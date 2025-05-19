import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface RecipeData {
  "@type": string | string[];
  name?: string;
  description?: string;
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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log("HTML length:", html.length);

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

        // Handle @graph structure
        if (parsed["@graph"]) {
          const recipeData = parsed["@graph"].find(
            (item: RecipeData) =>
              item["@type"] === "Recipe" ||
              (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))
          );
          if (recipeData) {
            jsonLd = recipeData;
          }
        } else if (
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
        name: $("h1").first().text().trim(),
        ingredients: $(".ingredients li")
          .map((_, el) => $(el).text().trim())
          .get(),
        instructions: $(".instructions li")
          .map((_, el) => $(el).text().trim())
          .get(),
      };

      if (
        recipeData.ingredients.length > 0 ||
        recipeData.instructions.length > 0
      ) {
        return NextResponse.json(recipeData);
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

    const formattedRecipe = {
      name: recipeData.name || "",
      description: recipeData.description || "",
      ingredients: scaledIngredients || [],
      instructions: Array.isArray(recipeData.recipeInstructions)
        ? recipeData.recipeInstructions.map(
            (step: { text?: string } | string) =>
              typeof step === "string" ? step : step.text || ""
          )
        : [],
      totalTime: recipeData.totalTime || "",
      cookTime: recipeData.cookTime || "",
      prepTime: recipeData.prepTime || "",
      yield: servings ? `${servings} servings` : recipeData.recipeYield || "",
      category: recipeData.recipeCategory || "",
      cuisine: recipeData.recipeCuisine || "",
      keywords: recipeData.keywords || [],
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
          error instanceof Error ? error.message : "Failed to extract recipe",
      },
      { status: 500 }
    );
  }
}
