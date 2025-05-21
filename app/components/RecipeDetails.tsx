import React from "react";

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
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {recipeData.name}
      </h2>

      {recipeData.description && (
        <p className="text-gray-600 mb-6">{recipeData.description}</p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipeData.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recipe Details
          </h3>
          <div className="space-y-3">
            {recipeData.yield && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span className="text-gray-700">
                  Servings: {recipeData.yield}
                </span>
              </div>
            )}
            {recipeData.prepTime && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span className="text-gray-700">
                  Prep Time: {recipeData.prepTime}
                </span>
              </div>
            )}
            {recipeData.cookTime && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span className="text-gray-700">
                  Cook Time: {recipeData.cookTime}
                </span>
              </div>
            )}
            {recipeData.category && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span className="text-gray-700">
                  Category: {recipeData.category}
                </span>
              </div>
            )}
            {recipeData.cuisine && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500"
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
                <span className="text-gray-700">
                  Cuisine: {recipeData.cuisine}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {recipeData.nutrition && Object.keys(recipeData.nutrition).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Nutrition Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recipeData.nutrition.calories && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-lg font-semibold">
                  {recipeData.nutrition.calories}
                </p>
              </div>
            )}
            {recipeData.nutrition.proteinContent && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-lg font-semibold">
                  {recipeData.nutrition.proteinContent}
                </p>
              </div>
            )}
            {recipeData.nutrition.fatContent && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="text-lg font-semibold">
                  {recipeData.nutrition.fatContent}
                </p>
              </div>
            )}
            {recipeData.nutrition.carbohydrateContent && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-lg font-semibold">
                  {recipeData.nutrition.carbohydrateContent}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Instructions
        </h3>
        <div className="space-y-4">
          {recipeData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                {index + 1}
              </div>
              <p className="text-gray-700">{instruction}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
