import { Metadata } from "next";
import { Suspense } from "react";
import RecipeClient from "./RecipeClient";

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

const recipeMeta: Record<string, { title: string; description: string }> = {
  "spaghetti-carbonara": {
    title: "Spaghetti Carbonara – AI Step-by-Step Recipe Guide",
    description:
      "See how GuideMyRecipe breaks down spaghetti carbonara into clear kitchen actions, from prep to serve.",
  },
  "classic-pancakes": {
    title: "Classic Pancakes – AI Step-by-Step Recipe Guide",
    description:
      "See how GuideMyRecipe transforms classic pancakes into easy, kitchen-ready steps.",
  },
  "vegetable-stir-fry": {
    title: "Vegetable Stir Fry – AI Step-by-Step Recipe Guide",
    description:
      "See how GuideMyRecipe simplifies vegetable stir fry into clear, timed instructions.",
  },
  "chicken-noodle-soup": {
    title: "Chicken Noodle Soup – AI Step-by-Step Recipe Guide",
    description:
      "See how GuideMyRecipe turns chicken noodle soup into simple, step-by-step cooking actions.",
  },
  "chocolate-chip-cookies": {
    title: "Chocolate Chip Cookies – AI Step-by-Step Recipe Guide",
    description:
      "See how GuideMyRecipe breaks down chocolate chip cookies into easy baking steps.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const meta = recipeMeta[params.slug] || {
    title: "Recipe Example – GuideMyRecipe",
    description:
      "See how GuideMyRecipe transforms recipes into step-by-step kitchen instructions.",
  };
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://guidemyrecipe.com/examples/recipe/${params.slug}`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
        </div>
      }
    >
      <RecipeClient slug={params.slug} />
    </Suspense>
  );
}
