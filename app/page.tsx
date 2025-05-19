"use client";

import { useState, useEffect } from "react";

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
  originalServings: number;
  scaledServings: number;
}

export default function Home() {
  const [recipeUrl, setRecipeUrl] = useState("");
  const [recipeData, setRecipeData] = useState<RecipeData | null>(null);
  const [isCooking, setIsCooking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isCooking) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCooking]);

  const handleExtract = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/extract-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: recipeUrl }),
      });
      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Error extracting recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServingsChange = async (newServings: number) => {
    if (newServings < 1 || !recipeData) return;
    try {
      setIsLoading(true);
      const response = await fetch("/api/extract-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: recipeUrl,
          servings: newServings,
        }),
      });
      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Error updating servings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCooking = () => {
    setIsCooking(!isCooking);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    // Convert ISO 8601 duration to readable format
    const match = timeString.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return timeString;
    const [, hours, minutes] = match;
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.join(" ");
  };

  const formatElapsedTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Recipe Extractor</h1>
        <div className="mb-4">
          <input
            type="text"
            value={recipeUrl}
            onChange={(e) => setRecipeUrl(e.target.value)}
            placeholder="Enter recipe URL"
            className="border p-2 mr-2"
          />
          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
          >
            {isLoading ? "Loading..." : "Extract Recipe"}
          </button>
        </div>

        {recipeData && (
          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{recipeData.name}</h2>
              <p className="text-gray-600 mb-4">{recipeData.description}</p>

              <div className="flex flex-wrap gap-4 mb-4">
                {recipeData.yield && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Yield:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleServingsChange(recipeData.scaledServings - 1)
                        }
                        className="bg-gray-200 px-2 py-1 rounded"
                        disabled={isLoading}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {recipeData.scaledServings}
                      </span>
                      <button
                        onClick={() =>
                          handleServingsChange(recipeData.scaledServings + 1)
                        }
                        className="bg-gray-200 px-2 py-1 rounded"
                        disabled={isLoading}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                {recipeData.prepTime && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Prep Time:</span>
                    <span>{formatTime(recipeData.prepTime)}</span>
                  </div>
                )}
                {recipeData.cookTime && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Cook Time:</span>
                    <span>{formatTime(recipeData.cookTime)}</span>
                  </div>
                )}
                {recipeData.totalTime && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Total Time:</span>
                    <span>{formatTime(recipeData.totalTime)}</span>
                  </div>
                )}
              </div>

              {recipeData.nutrition &&
                Object.keys(recipeData.nutrition).length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h3 className="text-xl font-bold mb-2">
                      Nutrition Information
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {recipeData.nutrition.calories && (
                        <div>
                          <span className="font-semibold">Calories:</span>
                          <span className="ml-2">
                            {recipeData.nutrition.calories}
                          </span>
                        </div>
                      )}
                      {recipeData.nutrition.proteinContent && (
                        <div>
                          <span className="font-semibold">Protein:</span>
                          <span className="ml-2">
                            {recipeData.nutrition.proteinContent}
                          </span>
                        </div>
                      )}
                      {recipeData.nutrition.fatContent && (
                        <div>
                          <span className="font-semibold">Fat:</span>
                          <span className="ml-2">
                            {recipeData.nutrition.fatContent}
                          </span>
                        </div>
                      )}
                      {recipeData.nutrition.carbohydrateContent && (
                        <div>
                          <span className="font-semibold">Carbs:</span>
                          <span className="ml-2">
                            {recipeData.nutrition.carbohydrateContent}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              <div className="grid md:grid-cols-2 gap-8">
                {recipeData.ingredients &&
                  recipeData.ingredients.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
                      <ul className="list-disc pl-5 space-y-2">
                        {recipeData.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {recipeData.instructions &&
                  recipeData.instructions.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Instructions</h2>
                      <ol className="list-decimal pl-5 space-y-4">
                        {recipeData.instructions.map((instruction, index) => (
                          <li key={index} className="text-gray-700">
                            {instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Cooking Timer</h2>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-mono bg-gray-100 px-4 py-2 rounded">
                  {formatElapsedTime(elapsedTime)}
                </div>
                <button
                  onClick={toggleCooking}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {isCooking ? "Stop Cooking" : "Start Cooking"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Cooking Animation</h2>
              <div className="border p-4 rounded">
                {/* Placeholder for cooking animation */}
                <p>Animation will appear here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
