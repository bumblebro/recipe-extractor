import React, { useState, useMemo } from "react";

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

interface RecipeDetailsProps {
  recipeData: RecipeData;
}

export default function RecipeDetails({ recipeData }: RecipeDetailsProps) {
  const [scaleFactor, setScaleFactor] = useState(1);

  const formatDuration = (duration: string): string => {
    if (!duration) return "";

    // Remove 'PT' prefix and split into hours, minutes, and seconds
    const timeStr = duration.replace("PT", "");
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    // Extract hours
    const hoursMatch = timeStr.match(/(\d+)H/);
    if (hoursMatch) {
      hours = parseInt(hoursMatch[1]);
    }

    // Extract minutes
    const minutesMatch = timeStr.match(/(\d+)M/);
    if (minutesMatch) {
      minutes = parseInt(minutesMatch[1]);
    }

    // Extract seconds
    const secondsMatch = timeStr.match(/(\d+)S/);
    if (secondsMatch) {
      seconds = parseInt(secondsMatch[1]);
    }

    // Format the time
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
    }
    if (seconds > 0 && hours === 0) {
      parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
    }

    return parts.join(" ") || "0 mins";
  };

  // Extract the number from the yield string (e.g., "4 servings" -> 4)
  const originalYield = useMemo(() => {
    if (!recipeData.yield) return 1;

    // Handle both string and array cases
    const yieldStr = Array.isArray(recipeData.yield)
      ? recipeData.yield[0]
      : recipeData.yield;

    if (typeof yieldStr !== "string") return 1;

    const match = yieldStr.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  }, [recipeData.yield]);

  // Calculate scaled yield
  const scaledYield = useMemo(() => {
    return `${Math.round(originalYield * scaleFactor)} servings`;
  }, [originalYield, scaleFactor]);

  // Scale ingredients based on the scale factor
  const scaledIngredients = useMemo(() => {
    return recipeData.ingredients.map((ingredient) => {
      // Match numbers and units in the ingredient string
      const matches = ingredient.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
      if (!matches) return ingredient;

      const quantity = matches[1]; // First capture group is the quantity
      const scaledQuantity = parseFloat(quantity) * scaleFactor;

      // Format the scaled quantity (remove trailing zeros)
      const formattedQuantity =
        scaledQuantity % 1 === 0
          ? scaledQuantity.toString()
          : scaledQuantity.toFixed(2).replace(/\.?0+$/, "");

      // Replace the original quantity with the scaled one
      return ingredient.replace(quantity, formattedQuantity);
    });
  }, [recipeData.ingredients, scaleFactor]);

  const handleScaleChange = (newScale: number) => {
    setScaleFactor(newScale);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
        {recipeData.name}
      </h2>

      {recipeData.description && (
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          {recipeData.description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Ingredients
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScaleChange(scaleFactor - 0.5)}
                disabled={scaleFactor <= 0.5}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                aria-label="Decrease servings"
              >
                -
              </button>
              <span className="text-sm font-medium">
                {Math.round(originalYield * scaleFactor)} servings
              </span>
              <button
                onClick={() => handleScaleChange(scaleFactor + 0.5)}
                className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                aria-label="Increase servings"
              >
                +
              </button>
            </div>
          </div>
          <ul className="space-y-2">
            {scaledIngredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base text-gray-700">
                  {ingredient}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Recipe Details
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {recipeData.prepTime && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">
                      Prep Time
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDuration(recipeData.prepTime)}
                  </p>
                </div>
              )}
              {recipeData.cookTime && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">
                      Cook Time
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDuration(recipeData.cookTime)}
                  </p>
                </div>
              )}
              {recipeData.totalTime && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">
                      Total Time
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDuration(recipeData.totalTime)}
                  </p>
                </div>
              )}
              {recipeData.yield && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">
                      Servings
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {scaledYield}
                  </p>
                </div>
              )}
            </div>

            {(recipeData.category || recipeData.cuisine) && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {recipeData.category && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-4 h-4 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">
                          Category
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {recipeData.category}
                      </p>
                    </div>
                  )}
                  {recipeData.cuisine && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg
                          className="w-4 h-4 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-gray-500">
                          Cuisine
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {recipeData.cuisine}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {recipeData.keywords && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(recipeData.keywords)
                    ? recipeData.keywords
                    : [recipeData.keywords]
                  ).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {recipeData.nutrition && Object.keys(recipeData.nutrition).length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            Nutrition Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {recipeData.nutrition.calories && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Calories</p>
                <p className="text-base sm:text-lg font-semibold">
                  {recipeData.nutrition.calories}
                </p>
              </div>
            )}
            {recipeData.nutrition.proteinContent && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Protein</p>
                <p className="text-base sm:text-lg font-semibold">
                  {recipeData.nutrition.proteinContent}
                </p>
              </div>
            )}
            {recipeData.nutrition.fatContent && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Fat</p>
                <p className="text-base sm:text-lg font-semibold">
                  {recipeData.nutrition.fatContent}
                </p>
              </div>
            )}
            {recipeData.nutrition.carbohydrateContent && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-500">Carbs</p>
                <p className="text-base sm:text-lg font-semibold">
                  {recipeData.nutrition.carbohydrateContent}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Instructions
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {recipeData.instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm sm:text-base">
                {index + 1}
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
