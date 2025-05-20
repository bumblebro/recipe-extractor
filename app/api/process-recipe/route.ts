import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const ANIMATION_TYPES = [
  "cutting", // for chopping, slicing, dicing
  "stirring", // for mixing, stirring
  "waiting", // for resting, marinating
  "heating", // for cooking, boiling, simmering
  "mixing", // for combining ingredients
  "pouring", // for adding liquids
  "seasoning", // for adding spices, salt, etc.
  "whisking", // for beating, whisking
  "kneading", // for working with dough
  "rolling", // for pastry, pasta
  "grating", // for cheese, vegetables
  "peeling", // for fruits, vegetables
  "folding", // for batter, dough
  "sauteing", // for stir-frying, pan-frying
  "cooling", // for cooling down food, chilling
  "blending", // for pureeing, smoothies
  "steaming", // for vegetables, dumplings
  "mashing", // for potatoes, beans
  "straining", // for pasta, liquids
  "measuring", // for measuring ingredients
  "sifting", // for flour, dry ingredients
  "beating", // for eggs, cream
  "crushing", // for garlic, nuts, cookies
  "shredding", // for vegetables, meat
  "juicing", // for citrus fruits
] as const;

type AnimationType = (typeof ANIMATION_TYPES)[number];

interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
  preparation?: string;
}

interface ProcessedInstruction {
  stepNumber: number;
  totalSteps: number;
  ingredients: Ingredient[];
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
- beets
- aluminum foil
Action: wrap each beet individually in aluminum foil

For each instruction, extract:
1. The main action (e.g., "cut", "stir", "wrap")
2. Duration if mentioned (in seconds, minutes, or hours)
3. Ingredients involved (extract all ingredients mentioned in the step)
4. Temperature if mentioned
5. The type of animation needed
6. Any additional notes or tips

Ingredient Extraction Rules:
- Extract all ingredients mentioned in each step
- Include quantities if specified (e.g., "2 cups of flour")
- Include preparation state if mentioned (e.g., "chopped onions", "minced garlic")
- Group related ingredients (e.g., "salt and pepper" as ["salt", "pepper"])
- Include units of measurement when specified

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
    "animationType": "cutting" | "stirring" | "waiting" | "heating" | "mixing" | "pouring" | "seasoning" | "whisking" | "kneading" | "rolling" | "grating" | "peeling" | "folding" | "sauteing" | "cooling" | "blending" | "steaming" | "mashing" | "straining" | "measuring" | "sifting" | "beating" | "crushing" | "shredding" | "juicing" (optional),
    "notes": string (optional)
  }
]`;

export async function POST(request: Request) {
  try {
    const { instructions } = await request.json();

    if (!instructions || !Array.isArray(instructions)) {
      return NextResponse.json(
        { error: "Invalid input. Please provide an array of instructions." },
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
      const prompt = `${SYSTEM_PROMPT}\n\nInstructions:\n${instructions
        .map((instruction, index) => `${index + 1}. ${instruction}`)
        .join("\n")}\n\nParse these instructions into the required format.`;

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
        (instruction: any) => {
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
        const ingredients = extractIngredients(instruction);

        return {
          stepNumber: index + 1,
          totalSteps: instructions.length,
          ingredients,
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

  if (
    lowerInstruction.includes("cut") ||
    lowerInstruction.includes("chop") ||
    lowerInstruction.includes("slice")
  ) {
    return "cutting";
  }
  if (lowerInstruction.includes("stir") || lowerInstruction.includes("mix")) {
    return "stirring";
  }
  if (
    lowerInstruction.includes("wait") ||
    lowerInstruction.includes("rest") ||
    lowerInstruction.includes("cool")
  ) {
    return "waiting";
  }
  if (
    lowerInstruction.includes("heat") ||
    lowerInstruction.includes("cook") ||
    lowerInstruction.includes("boil")
  ) {
    return "heating";
  }
  if (lowerInstruction.includes("pour") || lowerInstruction.includes("add")) {
    return "pouring";
  }
  if (
    lowerInstruction.includes("season") ||
    lowerInstruction.includes("salt") ||
    lowerInstruction.includes("pepper")
  ) {
    return "seasoning";
  }
  if (lowerInstruction.includes("whisk") || lowerInstruction.includes("beat")) {
    return "whisking";
  }
  if (
    lowerInstruction.includes("knead") ||
    lowerInstruction.includes("dough")
  ) {
    return "kneading";
  }
  if (
    lowerInstruction.includes("roll") ||
    lowerInstruction.includes("pastry")
  ) {
    return "rolling";
  }
  if (
    lowerInstruction.includes("grate") ||
    lowerInstruction.includes("shred")
  ) {
    return "grating";
  }
  if (lowerInstruction.includes("peel") || lowerInstruction.includes("skin")) {
    return "peeling";
  }
  if (
    lowerInstruction.includes("fold") ||
    lowerInstruction.includes("incorporate")
  ) {
    return "folding";
  }
  if (
    lowerInstruction.includes("saute") ||
    lowerInstruction.includes("fry") ||
    lowerInstruction.includes("pan-fry")
  ) {
    return "sauteing";
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

    // Extract quantity and unit if present
    const quantityMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
    const quantity = quantityMatch ? parseFloat(quantityMatch[1]) : undefined;
    const unit = quantityMatch ? quantityMatch[2] : undefined;

    // Extract preparation method if present
    const prepMatch = trimmed.match(
      /(?:finely|roughly|thinly)?\s*(chopped|diced|sliced|minced|grated|peeled)/i
    );
    const preparation = prepMatch ? prepMatch[1] : undefined;

    // Extract ingredient name
    let name = trimmed;
    if (quantityMatch) {
      name = trimmed.slice(quantityMatch[0].length).trim();
    }
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
