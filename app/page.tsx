"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CookingAnimation from "./components/CookingAnimation";
import HowItWorks from "./components/HowItWorks";

interface RecipeData {
  name: string;
  description: string;
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

function RecipeForm() {
  const router = useRouter();
  const [recipeUrl, setRecipeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Navigate to the recipe page with the URL as a query parameter
      router.push(`/recipe?url=${encodeURIComponent(recipeUrl)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="recipe-url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Recipe URL
          </label>
          <div className="flex gap-4">
            <input
              type="url"
              id="recipe-url"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              placeholder="https://example.com/recipe"
              required
              className="flex-1 min-w-0 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Extract Recipe"
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("savorytouch13@gmail.com");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="space-y-8 ">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 w-full">
          <div className="flex justify-center w-full">
            <div className="flex items-center w-full max-w-7xl">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 text-center flex-1">
                <p className="text-sm text-yellow-700">
                  This application is currently in testing. Some features may
                  not work as expected. Your feedback is valuable!{" "}
                  <a
                    href="mailto:savorytouch13@gmail.com"
                    className="font-medium underline hover:text-yellow-800"
                  >
                    Send us your feedback
                  </a>{" "}
                  or{" "}
                  <button
                    onClick={copyToClipboard}
                    className="font-medium text-yellow-700 hover:text-yellow-800 focus:outline-none"
                  >
                    {copySuccess ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        Copy Email
                      </span>
                    )}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-32">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Recipe Guide
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a recipe URL below to get step-by-step cooking instructions
            with interactive animations and timers.
          </p>
        </div>

        <RecipeForm />

        <HowItWorks />
      </div>
    </main>
  );
}
