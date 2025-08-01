import { Metadata } from "next";
import { Suspense } from "react";
import RecipeClient from "./RecipeClient";

// Map of slugs to recipe URLs
const recipeLinks: Record<string, string> = {
  "chickpea-curry":
    "https://savorytouch.com/dietary-preferences/vegetarian/chickpea-curry/chickpea-and-green-bean-curry:-a-flavorful-delight",
  "lemon-herb-pasta-swordfish":
    "https://savorytouch.com/meal-types/dinner/pasta-dishes/lemon-and-herb-pasta-with-swordfish",
  "bourbon-bbq-chicken-wings":
    "https://savorytouch.com/cooking-techniques/grilling/chicken-wings/bourbon-bbq-grilled-chicken-wings",
  "lentil-shepherds-pie":
    "https://savorytouch.com/recipe-formats/batch-cooking/meal-prepping/batch-building-brilliance:-lentil-shepherd's-pie",
  "goat-cheese-fig-turkey-breast":
    "https://savorytouch.com/seasonal-recipes/holiday/thanksgiving-turkey/goat-cheese-and-fig-stuffed-turkey-breast-with-balsamic-glaze",
  "turkey-stuffed-mushrooms":
    "https://savorytouch.com/seasonal-recipes/holiday/thanksgiving-turkey/turkey-and-stuffing-stuffed-mushrooms",
  "seafood-bouillabaisse":
    "https://savorytouch.com/cooking-techniques/saut%C3%A9ing/seafood/sauteed-seafood-bouillabaisse-with-saffron-broth-and-rouille",
  "spicy-peanut-noodles-meatballs":
    "https://savorytouch.com/modern-trends/plant-based/plant-based-meatballs/spicy-peanut-noodles-with-plant-based-meatballs",
  "chocolate-fondue-anniversary":
    "https://savorytouch.com/special-occasions/anniversary/chocolate-fondue/chocolate-fondue:-a-sweet-anniversary-memory",
};

const recipeMeta: Record<string, { title: string; description: string }> = {
  "chickpea-curry": {
    title: "Chickpea & Green Bean Curry – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe breaks down chickpea and green bean curry into clear, kitchen-ready steps for a flavorful vegetarian delight.",
  },
  "lemon-herb-pasta-swordfish": {
    title: "Lemon & Herb Pasta with Swordfish – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe transforms lemon and herb pasta with swordfish into easy, step-by-step cooking actions for dinner.",
  },
  "bourbon-bbq-chicken-wings": {
    title: "Bourbon BBQ Grilled Chicken Wings – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe simplifies bourbon BBQ grilled chicken wings into clear, timed instructions for perfect grilling.",
  },
  "lentil-shepherds-pie": {
    title: "Lentil Shepherd's Pie – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe turns batch-building brilliance: lentil shepherd's pie into simple, step-by-step meal prepping actions.",
  },
  "goat-cheese-fig-turkey-breast": {
    title: "Goat Cheese & Fig Stuffed Turkey Breast – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe breaks down goat cheese and fig stuffed turkey breast with balsamic glaze into easy holiday cooking steps.",
  },
  "turkey-stuffed-mushrooms": {
    title: "Turkey & Stuffing Stuffed Mushrooms – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe transforms turkey and stuffing stuffed mushrooms into simple, step-by-step holiday appetizer instructions.",
  },
  "seafood-bouillabaisse": {
    title: "Sauteed Seafood Bouillabaisse – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe breaks down sauteed seafood bouillabaisse with saffron broth and rouille into clear, kitchen-ready steps.",
  },
  "spicy-peanut-noodles-meatballs": {
    title:
      "Spicy Peanut Noodles with Plant-Based Meatballs – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe simplifies spicy peanut noodles with plant-based meatballs into easy, step-by-step cooking actions.",
  },
  "chocolate-fondue-anniversary": {
    title:
      "Chocolate Fondue – A Sweet Anniversary Memory – AI Step-by-Step Guide",
    description:
      "GuideMyRecipe turns chocolate fondue into a sweet, step-by-step anniversary treat for special occasions.",
  },
};

type tParams = Promise<{ slug: string }>;

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: tParams }) {
  const { slug } = await params;
  const meta = recipeMeta[slug] || {
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
      url: `https://guidemyrecipe.com/examples/recipe/${slug}`,
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

export default async function RecipePage({ params }: { params: tParams }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-500 border-t-transparent"></div>
          <p className="text-gray-600 text-lg font-medium">Loading recipe...</p>
        </div>
      }
    >
      <RecipeClient slug={slug} />
    </Suspense>
  );
}
