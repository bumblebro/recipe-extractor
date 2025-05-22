import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// interface JsonLdData {
//   "@type": string;
//   "@graph"?: JsonLdData[];
//   name?: string;
//   description?: string;
//   recipeInstructions?:
//     | string
//     | { text: string }[]
//     | { "@type": string; text: string }[];
//   recipeIngredient?: string[];
//   totalTime?: string;
//   cookTime?: string;
//   prepTime?: string;
//   recipeYield?: string | string[];
//   recipeCategory?: string | string[];
//   recipeCuisine?: string | string[];
//   keywords?: string | string[];
//   nutrition?: {
//     "@type": string;
//     calories?: string;
//     proteinContent?: string;
//     fatContent?: string;
//     carbohydrateContent?: string;
//   };
// }

interface RecipeData {
  "@type": string | string[];
  name?: string;
  description?: string;
  image?: string | string[];
  recipeIngredient?: string[];
  recipeInstructions?: Array<{ text?: string } | string>;
  totalTime?: string;
  cookTime?: string;
  prepTime?: string;
  recipeYield?: string | string[];
  recipeCategory?: string;
  recipeCuisine?: string;
  keywords?: string | string[];
  mainEntity?: RecipeData;
  recipeServings?: number;
  nutrition?: {
    calories?: string;
    proteinContent?: string;
    fatContent?: string;
    carbohydrateContent?: string;
  };
}

interface WebPageData extends RecipeData {
  "@type": "WebPage";
  mainEntity: RecipeData;
}

interface InstructionStep {
  text?: string;
  name?: string;
  description?: string;
  "@type"?: string;
}

export async function POST(request: Request) {
  const { url, servings } = await request.json();

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json(
          {
            error:
              "This often happens when a website's code is formatted incorrectly. We've automatically recorded this incident so we can fix it.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json(
        {
          error:
            "This often happens when a website's code is formatted incorrectly. We've automatically recorded this incident so we can fix it.",
        },
        { status: response.status }
      );
    }

    const html = await response.text();
    // console.log("HTML length:", html);

    const $ = cheerio.load(html);

    // Log all script tags with type application/ld+json
    const scriptTags = $('script[type="application/ld+json"]');
    console.log("Number of JSON-LD scripts found:", scriptTags.length);

    let jsonLd: RecipeData | null = null;

    scriptTags.each((i, el) => {
      try {
        const content = $(el).html();
        if (!content) return;

        const parsed = JSON.parse(content);
        console.log("Parsed JSON-LD:", parsed);

        // Handle array of JSON-LD objects
        if (Array.isArray(parsed)) {
          const recipeData = parsed.find(
            (item: RecipeData) =>
              item["@type"] === "Recipe" ||
              (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))
          );
          if (recipeData) {
            jsonLd = recipeData;
          }
        }
        // Handle @graph structure
        else if (parsed["@graph"]) {
          const recipeData = parsed["@graph"].find(
            (item: RecipeData) =>
              item["@type"] === "Recipe" ||
              (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))
          );
          if (recipeData) {
            jsonLd = recipeData;
          }
        }
        // Handle direct Recipe or WebPage containing Recipe
        else if (
          parsed["@type"] === "Recipe" ||
          (parsed["@type"] === "WebPage" &&
            parsed.mainEntity &&
            parsed.mainEntity["@type"] === "Recipe")
        ) {
          jsonLd = parsed;
        }
      } catch (error) {
        console.error("Error parsing JSON-LD:", error);
      }
    });

    console.log("Final extracted JSON-LD:", jsonLd);

    if (!jsonLd) {
      // Try to extract recipe data from HTML structure as fallback
      const recipeData = {
        name:
          $("h1").first().text().trim() ||
          $(".recipe-title").first().text().trim() ||
          $("[class*='title']").first().text().trim(),
        description:
          $(".recipe-description").first().text().trim() ||
          $("[class*='description']").first().text().trim(),
        image:
          $(".recipe-image img, .recipe-photo img, [class*='recipe'] img")
            .first()
            .attr("src") ||
          $("meta[property='og:image']").attr("content") ||
          $("meta[name='twitter:image']").attr("content"),
        ingredients: $(
          ".ingredients li, .ingredient-item, [class*='ingredient'] li"
        )
          .map((_, el) => $(el).text().trim())
          .get()
          .filter((text) => text.length > 0),
        instructions: $(
          ".instructions li, .steps li, [class*='instruction'] li, [class*='step'] li"
        )
          .map((_, el) => $(el).text().trim())
          .get()
          .filter((text) => text.length > 0),
        totalTime: $("[class*='total-time']").first().text().trim(),
        cookTime: $("[class*='cook-time']").first().text().trim(),
        prepTime: $("[class*='prep-time']").first().text().trim(),
        yield:
          $("[class*='yield']").first().text().trim() ||
          $("[class*='servings']").first().text().trim(),
        category: $("[class*='category']").first().text().trim(),
        cuisine: $("[class*='cuisine']").first().text().trim(),
        keywords: $("[class*='keywords'] li, [class*='tags'] li")
          .map((_, el) => $(el).text().trim())
          .get()
          .filter((text) => text.length > 0),
        nutrition: {
          calories: $("[class*='calories']").first().text().trim(),
          proteinContent: $("[class*='protein']").first().text().trim(),
          fatContent: $("[class*='fat']").first().text().trim(),
          carbohydrateContent: $("[class*='carbs'], [class*='carbohydrate']")
            .first()
            .text()
            .trim(),
        },
      };

      // Clean up the extracted data
      const cleanRecipeData = {
        ...recipeData,
        name: recipeData.name || "Untitled Recipe",
        ingredients:
          recipeData.ingredients.length > 0
            ? recipeData.ingredients
            : (() => {
                // First try to find ingredients after "Ingredients:" text
                const ingredientsSection = $("p, div, h2, h3, h4")
                  .filter((_, el) => {
                    const text = $(el).text().trim();
                    return !!text.match(/^ingredients?:/i);
                  })
                  .first();

                if (ingredientsSection.length > 0) {
                  // Get all list items or paragraphs after the ingredients section
                  const ingredients = [];
                  let current = ingredientsSection.next();

                  while (
                    current.length > 0 &&
                    !current
                      .text()
                      .trim()
                      .match(/^instructions?:|^directions?:|^steps?:/i)
                  ) {
                    if (current.is("li")) {
                      ingredients.push(current.text().trim());
                    } else if (current.is("p")) {
                      const text = current.text().trim();
                      if (
                        text &&
                        !text.match(
                          /^ingredients?:|^instructions?:|^directions?:|^steps?:/i
                        )
                      ) {
                        ingredients.push(text);
                      }
                    }
                    current = current.next();
                  }

                  if (ingredients.length > 0) {
                    return ingredients;
                  }
                }

                // Fallback to looking for list items that don't look like steps/instructions
                return $("ul li, ol li")
                  .map((_, el) => $(el).text().trim())
                  .get()
                  .filter(
                    (text) =>
                      text.length > 0 &&
                      !text.match(/^step|^instruction|^prep|^cook|^total/i)
                  );
              })(),
        instructions:
          recipeData.instructions.length > 0
            ? recipeData.instructions
            : (() => {
                // First try to find instructions after "Instructions:" text
                const instructionsSection = $("p, div, h2, h3, h4")
                  .filter((_, el) => {
                    const text = $(el).text().trim();
                    return !!text.match(
                      /^instructions?:|^directions?:|^steps?:/i
                    );
                  })
                  .first();

                if (instructionsSection.length > 0) {
                  // Get all list items or paragraphs after the instructions section
                  const instructions = [];
                  let current = instructionsSection.next();

                  while (current.length > 0) {
                    if (current.is("li")) {
                      instructions.push(current.text().trim());
                    } else if (current.is("p")) {
                      const text = current.text().trim();
                      if (
                        text &&
                        !text.match(
                          /^ingredients?:|^instructions?:|^directions?:|^steps?:/i
                        )
                      ) {
                        instructions.push(text);
                      }
                    }
                    current = current.next();
                  }

                  if (instructions.length > 0) {
                    return instructions;
                  }
                }

                // Fallback to looking for paragraphs and divs that look like steps
                return $("p, div")
                  .map((_, el) => $(el).text().trim())
                  .get()
                  .filter(
                    (text) =>
                      text.length > 0 &&
                      text.match(/^step|^instruction|^\d+\.|^[a-z]\./i)
                  );
              })(),
      };

      // Only return if we have at least some basic recipe data
      if (
        cleanRecipeData.ingredients.length > 0 ||
        cleanRecipeData.instructions.length > 0
      ) {
        return NextResponse.json(cleanRecipeData);
      }

      return NextResponse.json(
        { error: "No recipe data found" },
        { status: 404 }
      );
    }

    // Handle both direct Recipe and WebPage containing Recipe
    const recipeData: RecipeData = (jsonLd as WebPageData).mainEntity || jsonLd;

    // Extract original servings from recipeYield
    const originalYield = recipeData.recipeYield;
    let originalServings = 1;

    if (typeof originalYield === "string") {
      const match = originalYield.match(/(\d+)/);
      if (match) {
        originalServings = parseInt(match[1], 10);
      }
    } else if (Array.isArray(originalYield)) {
      const match = originalYield[0].match(/(\d+)/);
      if (match) {
        originalServings = parseInt(match[1], 10);
      }
    }

    // Calculate scaling factor if servings are provided
    const scalingFactor = servings ? servings / originalServings : 1;

    // Scale ingredients if needed
    const scaledIngredients = recipeData.recipeIngredient?.map((ingredient) => {
      if (!servings) return ingredient;

      // Match numbers and fractions in the ingredient string
      return ingredient.replace(
        /(\d+)(?:\s*\/\s*\d+)?(?:\s*-\s*\d+)?(?:\s*to\s*\d+)?/g,
        (match) => {
          // Handle fractions
          if (match.includes("/")) {
            const [num, denom] = match
              .split("/")
              .map((n) => parseFloat(n.trim()));
            const decimal = num / denom;
            const scaled = decimal * scalingFactor;
            return scaled.toFixed(2);
          }

          // Handle ranges (e.g., "1-2" or "1 to 2")
          if (match.includes("-") || match.includes("to")) {
            const [min, max] = match
              .split(/[-to]/)
              .map((n) => parseFloat(n.trim()));
            const scaledMin = (min * scalingFactor).toFixed(2);
            const scaledMax = (max * scalingFactor).toFixed(2);
            return `${scaledMin}-${scaledMax}`;
          }

          // Handle single numbers
          const num = parseFloat(match);
          return (num * scalingFactor).toFixed(2);
        }
      );
    });

    // Process instructions to handle both string and object formats
    const processInstructions = (
      instructions: (string | InstructionStep)[]
    ): string[] => {
      return instructions
        .map((step) => {
          if (typeof step === "string") return step;
          if (typeof step === "object") {
            if (step.text) return step.text;
            if (step.name) return step.name;
            if (step.description) return step.description;
            if (step["@type"] === "HowToStep" && step.text) return step.text;
          }
          return "";
        })
        .filter(Boolean);
    };

    const formattedRecipe = {
      name: recipeData.name || "",
      description: recipeData.description || "",
      image: recipeData.image || "",
      ingredients: scaledIngredients || [],
      instructions: Array.isArray(recipeData.recipeInstructions)
        ? processInstructions(recipeData.recipeInstructions)
        : [],
      totalTime: recipeData.totalTime || "",
      cookTime: recipeData.cookTime || "",
      prepTime: recipeData.prepTime || "",
      yield: servings ? `${servings} servings` : recipeData.recipeYield || "",
      category: recipeData.recipeCategory || "",
      cuisine: recipeData.recipeCuisine || "",
      keywords: Array.isArray(recipeData.keywords)
        ? recipeData.keywords
        : typeof recipeData.keywords === "string"
        ? recipeData.keywords.split(",").map((k) => k.trim())
        : [],
      nutrition: recipeData.nutrition || {},
      originalServings: originalServings,
      scaledServings: servings || originalServings,
    };

    return NextResponse.json(formattedRecipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      {
        error:
          "This often happens when a website's code is formatted incorrectly. We've automatically recorded this incident so we can fix it.",
      },
      { status: 500 }
    );
  }
}
