import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <nav className="flex flex-wrap justify-center gap-8 sm:gap-12">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-base sm:text-lg font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-base sm:text-lg font-medium"
            >
              About Us
            </Link>
            <Link
              href="mailto:contact@guidemyrecipe.com"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-base sm:text-lg font-medium"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-base sm:text-lg font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-base sm:text-lg font-medium"
            >
              Terms and Conditions
            </Link>
          </nav>
        </div>
        <div className="py-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-base sm:text-lg">
            © {new Date().getFullYear()} GuideMyRecipe.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
