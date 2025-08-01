"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

interface Stat {
  value: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
}

interface UsageExample {
  title: string;
  description: string;
  example: string;
  icon: React.ReactNode;
}

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

const steps: Step[] = [
  {
    title: "Paste Recipe URL",
    description: "Simply paste the URL of any recipe from supported websites",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "AI Processing",
    description: "Our AI analyzes and extracts all recipe information",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
  },
  {
    title: "Interactive Guide",
    description:
      "Follow step-by-step instructions with timers and ingredient tracking",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
  },
  {
    title: "Real-time Guidance",
    description: "Get instant feedback and tips while cooking",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

const features: Feature[] = [
  {
    title: "Smart Recipe Extraction",
    description:
      "Automatically extract ingredients, instructions, and cooking times from any recipe website with our advanced AI technology.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    title: "Interactive Timers",
    description:
      "Built-in timers for each cooking step, ensuring perfect timing for your dishes.",
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
  },
  {
    title: "Ingredient Scaling",
    description:
      "Easily adjust recipe quantities to match your desired number of servings.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    ),
  },
];

const benefits: Benefit[] = [
  {
    title: "Save Time",
    description:
      "No more scrolling through ads and unnecessary content. Get straight to cooking.",
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
  },
  {
    title: "Reduce Stress",
    description:
      "Never miss a step or ingredient with our interactive guide and ingredient tracking.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    title: "Learn & Improve",
    description:
      "Get real-time tips and learn new cooking techniques as you cook.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

const stats: Stat[] = [
  {
    value: "2000+",
    label: "Recipe Sites Supported",
    sublabel: "Including AllRecipes, Food Network, NYT Cooking & more",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    value: "95%",
    label: "Recipe URL Support",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    value: "10K+",
    label: "Recipes Extracted",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    value: "24/7",
    label: "AI Support",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Home Chef",
    quote:
      "This app has completely transformed how I cook. The step-by-step guidance is incredible!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Food Blogger",
    quote:
      "As someone who tries new recipes daily, this tool has been a game-changer for my content creation.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Cooking Instructor",
    quote:
      "I recommend this to all my students. It's like having a personal cooking assistant!",
    rating: 5,
  },
];

const usageExamples: UsageExample[] = [
  {
    title: "Step 1: Find Your Recipe",
    description:
      "Copy the URL of any recipe from supported sites like AllRecipes, Food Network, or NYT Cooking.",
    example: "https://pinchofyum.com/roasted-red-pepper-pasta",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    title: "Step 2: Add to GuideMyRecipe",
    description: "Add the recipe URL to our domain with the correct format.",
    example:
      "guidemyrecipe.com/recipe?url=https://pinchofyum.com/roasted-red-pepper-pasta",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
  {
    title: "Step 3: Start Cooking",
    description:
      "Get your interactive cooking guide with timers and step-by-step instructions",
    example: "Your recipe is now ready to cook!",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const renderSection = (
  title: string,
  description: string,
  items: (Step | Feature | Benefit)[],
  type: "steps" | "features" | "benefits"
) => {
  const sectionStyles = {
    steps: {
      container: "bg-gradient-to-br from-slate-50 to-white",
      card: "bg-white rounded-xl shadow-lg p-8 h-full transform hover:scale-105 transition-all duration-300",
      icon: "flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full",
      iconColor: "text-slate-600",
      layout: "flex flex-col md:flex-row items-center gap-8",
      textAlign: "text-center md:text-left",
    },
    features: {
      container: "bg-white",
      card: "bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg p-8 h-full transform hover:scale-105 transition-all duration-300",
      icon: "flex items-center justify-center w-16 h-16 bg-slate-600 rounded-lg",
      iconColor: "text-white",
      layout: "flex flex-col items-center text-center gap-6",
      textAlign: "text-center",
    },
    benefits: {
      container: "bg-gradient-to-br from-slate-600 to-slate-800",
      card: "bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 h-full transform hover:scale-105 transition-all duration-300",
      icon: "flex items-center justify-center w-16 h-16 bg-white/20 rounded-full",
      iconColor: "text-white",
      layout: "flex flex-col items-center text-center gap-6",
      textAlign: "text-center",
    },
  };

  const style = sectionStyles[type];

  return (
    <div className={`py-16 ${style.container}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-4xl font-bold mb-4 ${
              type === "benefits" ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-xl max-w-3xl mx-auto ${
              type === "benefits" ? "text-slate-100" : "text-gray-600"
            }`}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid grid-cols-1 ${
            type === "steps"
              ? "space-y-12"
              : "md:grid-cols-2 lg:grid-cols-3 gap-8"
          }`}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="relative"
            >
              <div className={style.card}>
                <div className={style.layout}>
                  <div className="flex-shrink-0">
                    <div className={style.icon}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className={style.iconColor}
                      >
                        {item.icon}
                      </motion.div>
                    </div>
                  </div>
                  <div className={`flex-1 ${style.textAlign}`}>
                    <h3
                      className={`text-2xl font-semibold mb-4 ${
                        type === "benefits" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-lg ${
                        type === "benefits" ? "text-slate-100" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const renderUsageGuide = () => (
  <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          How to Use GuideMyRecipe
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Transform any recipe into an interactive cooking guide in three simple
          steps
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {usageExamples.map((example, index) => (
          <motion.div
            key={example.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <div className="text-slate-600">{example.icon}</div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {example.title}
              </h3>
              <p className="text-gray-600">{example.description}</p>
              <div className="w-full mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <code className="text-sm text-slate-600 break-all">
                    {example.example}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-block bg-slate-50 rounded-lg p-6 max-w-2xl">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Quick Tip
          </h4>
          <p className="text-gray-600">
            You can also share your recipe by copying the full URL. Anyone with
            the link can access the same interactive cooking guide!
          </p>
        </div>
      </motion.div>
    </div>
  </div>
);

const featuredrecipes = () => (
  <div className="mt-16 py-16 bg-gradient-to-br from-slate-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight drop-shadow-sm">
          More Featured Recipes
        </h2>
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
                    {idx === 0 && "🍝"}
                    {idx === 1 && "🥞"}
                    {idx === 2 && "🥦"}
                    {idx === 3 && "🍲"}
                    {idx === 4 && "🍪"}
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
    </div>
  </div>
);

const renderStats = () => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          By the Numbers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Our impact in numbers
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-50 rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="text-slate-600">{stat.icon}</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-600 mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
            {stat.sublabel && (
              <div className="text-sm text-gray-500 mt-2">{stat.sublabel}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const renderTestimonials = () => (
  <div className="py-16 bg-gradient-to-br from-slate-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Join thousands of happy cooks who have transformed their cooking
          experience
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
            <div className="flex mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderUsageGuide()}
        {featuredrecipes()}

        {renderSection(
          "How It Works",
          "Transform any recipe into an interactive cooking guide in four simple steps",
          steps,
          "steps"
        )}

        {renderStats()}

        {renderSection(
          "Key Features",
          "Discover the powerful features that make cooking easier and more enjoyable",
          features,
          "features"
        )}

        {renderSection(
          "Benefits",
          "Experience the advantages of using our AI-powered cooking assistant",
          benefits,
          "benefits"
        )}

        {renderTestimonials()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-16 text-center pb-16"
        >
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors duration-300"
          >
            Get Started
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
