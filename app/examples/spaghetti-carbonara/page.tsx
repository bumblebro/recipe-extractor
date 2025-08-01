import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SpaghettiCarbonaraExample() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">
          Spaghetti Carbonara
        </h1>
        <div className="flex justify-center mb-6">
          <Image
            src="/placeholder-recipe.jpg"
            alt="Spaghetti Carbonara"
            width={600}
            height={320}
            className="rounded-xl object-cover shadow-md"
            priority
          />
        </div>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-1">
            Description
          </h2>
          <p className="text-gray-700">
            A creamy Italian pasta dish with eggs, cheese, pancetta, and pepper.
            This classic recipe is quick to make and full of flavor.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-1">
            Ingredients
          </h2>
          <ul className="list-disc pl-6 text-gray-800">
            <li>200g spaghetti</li>
            <li>100g pancetta or bacon, diced</li>
            <li>2 large eggs</li>
            <li>50g grated Parmesan cheese</li>
            <li>2 cloves garlic, minced</li>
            <li>Salt and freshly ground black pepper</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-1">
            Instructions
          </h2>
          <ol className="list-decimal pl-6 text-gray-800 space-y-1">
            <li>
              Cook the spaghetti in salted boiling water until al dente. Reserve
              1/2 cup of pasta water and drain the rest.
            </li>
            <li>
              In a pan, cook pancetta or bacon until crispy. Add garlic and
              sauté for 1 minute.
            </li>
            <li>In a bowl, whisk together eggs and Parmesan cheese.</li>
            <li>
              Add the drained spaghetti to the pan with pancetta. Remove from
              heat.
            </li>
            <li>
              Quickly pour in the egg and cheese mixture, tossing to coat the
              pasta. Add reserved pasta water as needed for creaminess.
            </li>
            <li>
              Season with salt and plenty of black pepper. Serve immediately.
            </li>
          </ol>
        </section>
        <div className="mt-8 text-center">
          <Link
            href="/examples"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors"
          >
            ← Back to Examples
          </Link>
        </div>
      </div>
    </div>
  );
}
