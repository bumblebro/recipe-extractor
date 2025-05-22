import Link from "next/link";
import { generateMetadata } from "../metadata.config";

export const metadata = generateMetadata({
  title: "About GuideMyRecipe",
  description:
    "Learn about GuideMyRecipe.com - your AI-powered cooking assistant. Discover how we help you transform any recipe into an interactive cooking guide with step-by-step instructions.",
  path: "/about",
  image: "https://guidemyrecipe.com/about-og-image.jpg",
});

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-6"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              About RecipeExtractor
            </h1>
            <p className="text-gray-600">Your AI-Powered Cooking Assistant</p>
          </div>

          <div className="prose prose-blue max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4">
                RecipeExtractor is designed to make cooking more accessible and
                enjoyable for everyone. We use advanced AI technology to help
                you extract, organize, and follow recipes from any website,
                making your cooking experience smoother and more efficient.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Smart Recipe Extraction
                  </h3>
                  <p className="text-gray-700">
                    Automatically extract ingredients, instructions, and cooking
                    times from any recipe website.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Interactive Cooking Guide
                  </h3>
                  <p className="text-gray-700">
                    Step-by-step instructions with timers and ingredient
                    checklists to keep you on track.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Servings Calculator
                  </h3>
                  <p className="text-gray-700">
                    Easily adjust recipe quantities to match your desired number
                    of servings.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Visual Cooking Animations
                  </h3>
                  <p className="text-gray-700">
                    Engaging animations that help you understand cooking
                    techniques and steps.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                How It Works
              </h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-4">
                <li>
                  <strong>Paste Recipe URL:</strong> Simply paste the URL of any
                  recipe website.
                </li>
                <li>
                  <strong>AI Processing:</strong> Our AI analyzes the recipe and
                  extracts all relevant information.
                </li>
                <li>
                  <strong>Interactive Interface:</strong> Follow the recipe with
                  our step-by-step guide, complete with timers and ingredient
                  tracking.
                </li>
                <li>
                  <strong>Cook with Confidence:</strong> Get real-time guidance
                  and never miss a step in your cooking process.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Technology
              </h2>
              <p className="text-gray-700 mb-4">
                RecipeExtractor is built using cutting-edge technologies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Advanced Natural Language Processing for recipe extraction
                </li>
                <li>Machine Learning algorithms for ingredient recognition</li>
                <li>Real-time processing and updates</li>
                <li>Responsive design for all devices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                Have questions or suggestions? We&apos;d love to hear from you!
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Email: contact@recipeextractor.com
                </p>
                <p className="text-gray-700 mt-2">
                  Follow us on social media for updates and cooking tips:
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Twitter
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Instagram
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Facebook
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
