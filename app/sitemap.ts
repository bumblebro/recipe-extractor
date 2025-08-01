import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://guidemyrecipe.com";

  // Define your static routes with their metadata
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/recipe`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/featured`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  const recipeSlugs = [
    "chickpea-curry",
    "lemon-herb-pasta-swordfish",
    "bourbon-bbq-chicken-wings",
    "lentil-shepherds-pie",
    "goat-cheese-fig-turkey-breast",
    "turkey-stuffed-mushrooms",
    "seafood-bouillabaisse",
    "spicy-peanut-noodles-meatballs",
    "chocolate-fondue-anniversary",
  ];

  // Add dynamic recipe example pages
  recipeSlugs.forEach((slug) => {
    routes.push({
      url: `${baseUrl}/examples/recipe/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  return routes;
}
