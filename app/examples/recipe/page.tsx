"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import CookingAnimation from "../../components/CookingAnimation";
import Link from "next/link";

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

function RecipeContent() {
  const searchParams = useSearchParams();
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const url = searchParams.get("url");
      if (!url) {
        setError("No recipe URL provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/extract-recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Failed to extract recipe");
        }

        const data = await response.json();
        setRecipeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-500 border-t-transparent"></div>
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
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            aria-label="Return to home page"
          >
            Return Home
          </button>
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
        <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow p-6 max-w-xl text-center">
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Want to try another recipe?
          </h3>
          <p className="text-gray-700 mb-4">
            Paste a new recipe link or return to the homepage to start over with
            a different dish.
          </p>
          <Link
            href="/"
            className="inline-block bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-colors"
            aria-label="Return to home page"
          >
            ← Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-500 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
        </div>
      }
    >
      <RecipeContent />
    </Suspense>
  );
}
