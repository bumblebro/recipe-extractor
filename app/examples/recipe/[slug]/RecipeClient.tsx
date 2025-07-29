"use client";

import { useEffect, useState, Suspense } from "react";
import CookingAnimation from "../../../components/CookingAnimation";
import Link from "next/link";

// Map of slugs to recipe URLs
const recipeLinks: Record<string, string> = {
  "spaghetti-carbonara":
    "https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/",
  "classic-pancakes":
    "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/",
  "vegetable-stir-fry": "https://www.loveandlemons.com/vegetable-stir-fry/",
  "chicken-noodle-soup":
    "https://www.delish.com/cooking/recipe-ideas/a19665918/easy-chicken-noodle-soup-recipe/",
  "chocolate-chip-cookies":
    "https://sallysbakingaddiction.com/chocolate-chip-cookies/",
};

interface RecipeData {
  name: string;
  description: string;
  image?: string | string[];
  ingredients: string[];
  instructions: string[];
  totalTime: string;
  cookTime: string;
  prepTime: string;
  yield: string;
  category: string;
  cuisine: string;
  keywords: string[];
  nutrition: {
    calories?: string;
    proteinContent?: string;
    fatContent?: string;
    carbohydrateContent?: string;
  };
}

export default function RecipeClient({ slug }: { slug: string }) {
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const url = recipeLinks[slug];
      if (!url) {
        setError("Recipe not found");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("/api/extract-recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!response.ok) throw new Error("Failed to extract recipe");
        const data = await response.json();
        setRecipeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipeData) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Error Processing Recipe
          </h2>
          <p className="text-red-600 mb-4">{error || "Recipe not found"}</p>
          <Link
            href="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
            aria-label="Return to home page"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
      {/* <RecipeDetails recipeData={recipeData} /> */}
      <div className="mt-8">
        <CookingAnimation
          instructions={recipeData.instructions}
          ingredients={recipeData.ingredients.map((ingredient) => ({
            name: ingredient,
            quantity: null,
            unit: null,
            preparation: undefined,
          }))}
          onStepComplete={(stepIndex) => {
            console.log(`Step ${stepIndex + 1} completed`);
          }}
          recipeData={recipeData}
        />
      </div>
      <div className="mt-12 flex flex-col items-center justify-center">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow p-6 max-w-xl text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            Want to try another recipe?
          </h3>
          <p className="text-gray-700 mb-4">
            Paste a new recipe link or return to the homepage to start over with
            a different dish.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
            aria-label="Return to home page"
          >
            ← Go to Home
          </Link>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center tracking-tight drop-shadow-sm">
          More Featured Recipes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(recipeLinks).map(([slug, url], idx) => (
            <Link
              key={slug}
              href={`/examples/recipe/${slug}`}
              className="group block bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 p-6 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full mb-4 flex items-center justify-center shadow-inner">
                  <span className="text-3xl select-none">
                    {idx === 0 && "🍝"}
                    {idx === 1 && "🥞"}
                    {idx === 2 && "🥦"}
                    {idx === 3 && "🍲"}
                    {idx === 4 && "🍪"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-blue-700 mb-1 capitalize text-center group-hover:text-blue-900 transition-colors">
                  {slug.replace(/-/g, " ")}
                </h3>
                <p className="text-xs text-gray-500 text-center truncate w-full mb-2">
                  {url.replace(/^https?:\/\/(www\.)?/, "")}
                </p>
                <span className="mt-2 inline-block bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow transition-colors">
                  View Recipe
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
