import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Examples – See How GuideMyRecipe Turns Recipes into Step-by-Step Cooking",
  description:
    "Explore real examples of how GuideMyRecipe converts recipes into kitchen-ready, timed cooking instructions using AI. See pasta, soup, dessert, and more.",
};

const exampleRecipes = [
  {
    title: "Spaghetti Carbonara",
    image: "/placeholder-recipe.jpg",
    source: "https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/",
    sourceLabel: "simplyrecipes.com",
    url: "/examples/spaghetti-carbonara",
  },
  {
    title: "Classic Pancakes",
    image: "/placeholder-recipe.jpg",
    source:
      "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/",
    sourceLabel: "allrecipes.com",
    url: "/examples/classic-pancakes",
  },
  {
    title: "Vegetable Stir Fry",
    image: "/placeholder-recipe.jpg",
    source: "https://www.loveandlemons.com/vegetable-stir-fry/",
    sourceLabel: "loveandlemons.com",
    url: "/examples/vegetable-stir-fry",
  },
  {
    title: "Chicken Noodle Soup",
    image: "/placeholder-recipe.jpg",
    source:
      "https://www.delish.com/cooking/recipe-ideas/a19665918/easy-chicken-noodle-soup-recipe/",
    sourceLabel: "delish.com",
    url: "/examples/chicken-noodle-soup",
  },
  {
    title: "Chocolate Chip Cookies",
    image: "/placeholder-recipe.jpg",
    source: "https://sallysbakingaddiction.com/chocolate-chip-cookies/",
    sourceLabel: "sallysbakingaddiction.com",
    url: "/examples/chocolate-chip-cookies",
  },
];

export default function ExamplesPage() {
  return (
    <main
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2.5rem 1rem",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #f0e7ff 0%, #e0f7fa 100%)",
          borderRadius: 18,
          padding: "2.5rem 2rem 2rem 2rem",
          marginBottom: 40,
          boxShadow: "0 4px 24px rgba(80, 80, 180, 0.07)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "1.2rem",
            color: "#2d2d5a",
            letterSpacing: -1,
          }}
        >
          See GuideMyRecipe in Action
        </h1>
        <p
          style={{
            fontSize: "1.18rem",
            color: "#444",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          Wondering how it works? Below are real recipe links transformed by our
          AI into step-by-step, kitchen-friendly instructions. These examples
          show how we break down complex recipes into simple actions—complete
          with timing, tools, and tips.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "2.2rem",
          justifyContent: "center",
        }}
      >
        {exampleRecipes.map((recipe) => (
          <div
            key={recipe.title}
            className="example-card"
            style={{
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 4px 18px rgba(80, 80, 180, 0.09)",
              padding: "1.7rem 1.2rem 1.2rem 1.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "transform 0.18s, box-shadow 0.18s",
              cursor: "pointer",
              border: "1.5px solid #ececec",
            }}
          >
            <div
              style={{
                width: 220,
                height: 140,
                marginBottom: 18,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 8px #e0e0e0",
              }}
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={220}
                height={140}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
            <h2
              style={{
                fontSize: "1.22rem",
                fontWeight: 700,
                margin: "0 0 0.5rem 0",
                textAlign: "center",
                color: "#2d2d5a",
                letterSpacing: -0.5,
              }}
            >
              {recipe.title}
            </h2>
            <p
              style={{
                fontSize: "0.99rem",
                color: "#666",
                margin: 0,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Original Source:{" "}
              <a
                href={recipe.source}
                target="_blank"
                rel="noopener"
                style={{
                  color: "#0070f3",
                  textDecoration: "underline",
                  fontWeight: 500,
                }}
              >
                {recipe.sourceLabel}
              </a>
            </p>
            <Link
              href={recipe.url}
              style={{
                marginTop: 14,
                background: "linear-gradient(90deg, #7b61ff 0%, #21d4fd 100%)",
                color: "#fff",
                padding: "0.6rem 1.3rem",
                borderRadius: 9,
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "1.04rem",
                boxShadow: "0 2px 8px #e0e0e0",
                transition: "background 0.15s, box-shadow 0.15s",
                display: "inline-block",
                letterSpacing: 0.2,
              }}
            >
              View Step-by-Step
            </Link>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, textAlign: "center" }}>
        <Link
          href="/"
          style={{
            color: "#7b61ff",
            fontWeight: 600,
            fontSize: "1.13rem",
            textDecoration: "underline dotted",
          }}
        >
          ← Try your own recipe
        </Link>
      </div>
    </main>
  );
}
