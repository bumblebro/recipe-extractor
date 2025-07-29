import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { AnimationType } from "../../types/animations";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  preparation?: string;
}

interface ProcessedInstruction {
  stepNumber: number;
  totalSteps: number;
  ingredients?: Ingredient[];
  action: string;
  duration?: number;
  durationUnit?: "seconds" | "minutes" | "hours";
  temperature?: number;
  temperatureUnit?: "C" | "F";
  animationType?: AnimationType;
  notes?: string;
}

const SYSTEM_PROMPT = `You are a recipe instruction parser. Your task is to break down cooking instructions into concise, structured steps.

For each instruction, follow this format:
1. First, list the ingredients needed for this step
2. Then, provide a clear, concise action instruction

Example format:
Step 4 of 20
Ingredients:
- 2 large beets
- 1 sheet aluminum foil
Action: wrap each beet individually in aluminum foil

For each instruction, extract:
1. The main action (e.g., "cut", "stir", "wrap")
2. Duration if mentioned (in seconds, minutes, or hours)
3. Ingredients involved with their quantities and units:
   - Always include quantity and unit fields (set to null if not specified)
   - Extract quantities in various formats:
     * "2 cups of flour" -> quantity: 2, unit: "cups"
     * "1/2 teaspoon salt" -> quantity: 0.5, unit: "teaspoon"
     * "3 large eggs" -> quantity: 3, unit: "large"
     * "a pinch of salt" -> quantity: null, unit: "pinch"
     * "to taste" -> quantity: null, unit: "to taste"
4. Temperature if mentioned
5. The type of animation needed
6. Any additional notes or tips

Ingredient Extraction Rules:
- Extract all ingredients mentioned in each step
- ALWAYS include quantity and unit fields (set to null if not specified)
- Include preparation state if mentioned (e.g., "chopped onions", "minced garlic")
- Group related ingredients (e.g., "salt and pepper" as ["salt", "pepper"])
- Handle various quantity formats:
  * Fractions (1/2, 1/4, etc.)
  * Decimals (0.5, 1.5, etc.)
  * Whole numbers
  * Descriptive amounts ("a pinch", "to taste", etc.)
- Handle various unit formats:
  * Standard units (cups, tablespoons, teaspoons, etc.)
  * Weight units (grams, ounces, pounds, etc.)
  * Volume units (ml, liters, etc.)
  * Descriptive units (large, medium, small, etc.)
  * Special cases ("to taste", "as needed", etc.)

Instruction Parsing Rules:
- Break down complex instructions into clear, actionable steps
- Extract timing information in various formats:
  * "for X minutes/hours/seconds"
  * "until X is done"
  * "until golden brown"
  * "until tender"
- Extract temperature information in various formats:
  * "at X degrees C/F"
  * "to X degrees C/F"
  * "on high/medium/low heat"
- Identify preparation methods:
  * "finely chopped"
  * "roughly diced"
  * "thinly sliced"
  * "minced"
  * "grated"
  * "peeled"

Available animation types:
- cutting: for chopping, slicing, dicing
- stirring: for mixing, stirring
- waiting: for resting, marinating
- heating: for cooking, boiling, simmering
- mixing: for combining ingredients
- pouring: for adding liquids
- seasoning: for adding spices, salt, etc.
- whisking: for beating, whisking
- kneading: for working with dough
- rolling: for pastry, pasta
- grating: for cheese, vegetables
- peeling: for fruits, vegetables
- folding: for batter, dough
- sauteing: for stir-frying, pan-frying
- cooling: for cooling down food, chilling
- blending: for pureeing, smoothies
- steaming: for vegetables, dumplings
- mashing: for potatoes, beans
- straining: for pasta, liquids
- measuring: for measuring ingredients
- sifting: for flour, dry ingredients
- beating: for eggs, cream
- crushing: for garlic, nuts, cookies
- shredding: for vegetables, meat
- juicing: for citrus fruits
- serving: for plating and serving food

Return an array of JSON objects with the following structure for each instruction:
[
  {
    "action": "string (concise action instruction)",
    "duration": number (optional),
    "durationUnit": "seconds" | "minutes" | "hours" (optional),
    "ingredients": [
      {
        "name": "string",
        "quantity": number (optional),
        "unit": "string" (optional),
        "preparation": "string" (optional)
      }
    ],
    "temperature": number (optional),
    "temperatureUnit": "C" | "F" (optional),
    "animationType": "cutting" | "stirring" | "waiting" | "heating" | "mixing" | "pouring" | "seasoning" | "whisking" | "kneading" | "rolling" | "grating" | "peeling" | "folding" | "sauteing" | "cooling" | "blending" | "steaming" | "mashing" | "straining" | "measuring" | "sifting" | "beating" | "crushing" | "shredding" | "juicing" | "serving" (optional),
    "notes": string (optional)
  }
]`;

export async function POST(request: Request) {
  try {
    const { instructions, ingredients } = await request.json();

    if (!instructions || !Array.isArray(instructions)) {
      return NextResponse.json(
        { error: "Invalid input. Please provide an array of instructions." },
        { status: 400 }
      );
    }

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Invalid input. Please provide an array of ingredients." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    try {
      const prompt = `${SYSTEM_PROMPT}\n\nIngredients List:\n${ingredients
        .map((ingredient) => {
          const quantity = ingredient.quantity ? `${ingredient.quantity} ` : "";
          const unit = ingredient.unit ? `${ingredient.unit} ` : "";
          const preparation = ingredient.preparation
            ? `(${ingredient.preparation}) `
            : "";
          return `- ${quantity}${unit}${ingredient.name} ${preparation}`;
        })
        .join("\n")}\n\nInstructions:\n${instructions
        .map((instruction, index) => `${index + 1}. ${instruction}`)
        .join(
          "\n"
        )}\n\nParse these instructions into the required format, using the ingredients list above to ensure accurate quantity and unit information.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);

      // Parse the JSON response
      const parsedInstructions = JSON.parse(text);

      // Validate that we got an array of instructions
      if (!Array.isArray(parsedInstructions)) {
        throw new Error("Invalid response format - expected an array");
      }

      // Validate each instruction has the required fields
      const validatedInstructions = parsedInstructions.map(
        (instruction: ProcessedInstruction) => {
          if (typeof instruction.action !== "string") {
            throw new Error("Each instruction must have an 'action' field");
          }
          return instruction;
        }
      );

      return NextResponse.json({
        processedInstructions: validatedInstructions,
      });
    } catch (error) {
      console.error("Error processing instructions:", error);
      // Fallback to basic processing with all fields
      const processedInstructions = instructions.map((instruction, index) => {
        const { duration, durationUnit } = extractDuration(instruction);
        const { temperature, temperatureUnit } =
          extractTemperature(instruction);
        const stepIngredients = extractIngredients(instruction);

        // Match ingredients with the provided ingredients list to get accurate quantities
        const matchedIngredients = stepIngredients.map((stepIngredient) => {
          const matchedIngredient = ingredients.find(
            (ing) =>
              ing.name.toLowerCase() === stepIngredient.name.toLowerCase()
          );
          return {
            ...stepIngredient,
            quantity: matchedIngredient?.quantity ?? stepIngredient.quantity,
            unit: matchedIngredient?.unit ?? stepIngredient.unit,
          };
        });

        return {
          stepNumber: index + 1,
          totalSteps: instructions.length,
          ingredients: matchedIngredients,
          action: instruction,
          animationType: determineAnimationType(instruction),
          duration,
          durationUnit,
          temperature,
          temperatureUnit,
        };
      });
      return NextResponse.json({ processedInstructions });
    }
  } catch (error) {
    console.error("Error processing recipe:", error);
    return NextResponse.json(
      { error: "Failed to process recipe instructions" },
      { status: 500 }
    );
  }
}

function determineAnimationType(
  instruction: string
): ProcessedInstruction["animationType"] {
  const lowerInstruction = instruction.toLowerCase();

  const animationKeywords: Record<
    | "cutting"
    | "stirring"
    | "waiting"
    | "heating"
    | "mixing"
    | "pouring"
    | "seasoning"
    | "whisking"
    | "kneading"
    | "rolling"
    | "grating"
    | "peeling"
    | "folding"
    | "sauteing"
    | "cooling"
    | "blending"
    | "steaming"
    | "mashing"
    | "straining"
    | "measuring"
    | "sifting"
    | "beating"
    | "crushing"
    | "shredding"
    | "juicing"
    | "serving",
    string[]
  > = {
    cutting: ["chop", "slice", "dice"],
    stirring: ["stir", "mix"],
    waiting: ["rest", "marinate", "cool"],
    heating: ["boil", "simmer", "cook", "heat"],
    mixing: ["combine", "mix"],
    pouring: ["pour", "add liquid"],
    seasoning: ["season", "add salt", "add spices"],
    whisking: ["beat", "whisk"],
    kneading: ["knead"],
    rolling: ["roll"],
    grating: ["grate"],
    peeling: ["peel"],
    folding: ["fold"],
    sauteing: ["fry", "saute", "pan-fry"],
    cooling: ["cool", "chill"],
    blending: ["blend", "puree"],
    steaming: ["steam"],
    mashing: ["mash"],
    straining: ["strain", "drain"],
    measuring: ["measure"],
    sifting: ["sift"],
    beating: ["beat eggs", "whip cream"],
    crushing: ["crush", "smash"],
    shredding: ["shred"],
    juicing: ["juice"],
    serving: ["plate", "serve"],
  };

  for (const [type, keywords] of Object.entries(animationKeywords)) {
    for (const keyword of keywords) {
      if (lowerInstruction.includes(keyword)) {
        return type as ProcessedInstruction["animationType"];
      }
    }
  }

  return undefined;
}

function extractDuration(instruction: string): {
  duration?: number;
  durationUnit?: "seconds" | "minutes" | "hours";
} {
  const durationMatch = instruction.match(/(\d+)\s*(minute|hour|second)s?/i);
  if (!durationMatch) return {};

  const duration = parseInt(durationMatch[1]);
  const unit = durationMatch[2].toLowerCase() as
    | "minutes"
    | "hours"
    | "seconds";
  return { duration, durationUnit: unit };
}

function extractTemperature(instruction: string): {
  temperature?: number;
  temperatureUnit?: "C" | "F";
} {
  const tempMatch = instruction.match(/(\d+)\s*(?:degrees?\s*)?([CF])/i);
  if (!tempMatch) return {};

  const temperature = parseInt(tempMatch[1]);
  const unit = tempMatch[2].toUpperCase() as "C" | "F";
  return { temperature, temperatureUnit: unit };
}

function extractIngredients(instruction: string): Ingredient[] {
  const ingredients: Ingredient[] = [];
  const parts = instruction.split(/[,.]/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Enhanced quantity and unit extraction
    const quantityPatterns = [
      // Fractions
      /^(\d+)\/(\d+)\s*([a-zA-Z]+)/,
      // Decimals
      /^(\d+\.?\d*)\s*([a-zA-Z]+)/,
      // Whole numbers
      /^(\d+)\s*([a-zA-Z]+)/,
      // Descriptive amounts
      /^(a|an)\s+([a-zA-Z]+)/,
      // Special cases
      /^(to taste|as needed|pinch of|dash of)/i,
    ];

    let quantity: number | null = null;
    let unit: string | null = null;
    let name = trimmed;

    for (const pattern of quantityPatterns) {
      const match = trimmed.match(pattern);
      if (match) {
        if (pattern.toString().includes("\\/")) {
          // Handle fractions
          quantity = parseInt(match[1]) / parseInt(match[2]);
          unit = match[3];
          name = trimmed.slice(match[0].length).trim();
        } else if (
          pattern.toString().includes("to taste|as needed|pinch of|dash of")
        ) {
          // Handle special cases
          quantity = null;
          unit = match[1].toLowerCase();
          name = trimmed.slice(match[0].length).trim();
        } else if (pattern.toString().includes("a|an")) {
          // Handle "a" or "an"
          quantity = 1;
          unit = match[2];
          name = trimmed.slice(match[0].length).trim();
        } else {
          // Handle regular numbers
          quantity = parseFloat(match[1]);
          unit = match[2];
          name = trimmed.slice(match[0].length).trim();
        }
        break;
      }
    }

    // Extract preparation method if present
    const prepMatch = name.match(
      /(?:finely|roughly|thinly)?\s*(chopped|diced|sliced|minced|grated|peeled)/i
    );
    const preparation = prepMatch ? prepMatch[1] : undefined;

    if (prepMatch) {
      name = name.replace(prepMatch[0], "").trim();
    }

    // Clean up the name
    name = name.replace(/^(?:add|with|and|plus)\s+/i, "").trim();

    if (name) {
      ingredients.push({
        name,
        quantity,
        unit,
        preparation,
      });
    }
  }

  return ingredients;
}
