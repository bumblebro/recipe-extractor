import Link from "next/link";

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

export default function FeaturedRecipesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight drop-shadow-sm">
            Featured Recipes
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto font-light">
            Explore a variety of delicious recipes curated for you. Click any
            recipe to view its interactive guide!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(recipeLinks).map(([slug, url], idx) => (
            <Link
              key={slug}
              href={`/examples/recipe/${slug}`}
              className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-1 transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-3xl select-none">
                      {idx === 0 && "🍛"}
                      {idx === 1 && "🍝"}
                      {idx === 2 && "🍗"}
                      {idx === 3 && "🥧"}
                      {idx === 4 && "🦃"}
                      {idx === 5 && "🍄"}
                      {idx === 6 && "🦐"}
                      {idx === 7 && "🥡"}
                      {idx === 8 && "🍫"}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1 capitalize group-hover:text-slate-900 transition-colors">
                  {slug.replace(/-/g, " ")}
                </h3>
                <p className="text-xs text-gray-500 text-center truncate w-full mb-2 font-light">
                  {url.replace(/^https?:\/\/(www\.)?/, "")}
                </p>
                <span className="mt-2 inline-block border border-slate-600 text-slate-600 bg-white group-hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-full shadow transition-colors">
                  View Recipe
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
