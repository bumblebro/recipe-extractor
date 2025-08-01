"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Logo />
          </div>
          {/* Hamburger for mobile */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              aria-label="Home Page"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-slate-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              aria-label="About Us Page"
            >
              About
            </Link>
            <Link
              href="/"
              className="ml-2 border border-slate-600 text-slate-600 px-4 py-2 rounded-md text-sm font-semibold shadow transition-colors bg-transparent hover:bg-slate-50"
              aria-label="Try your own recipe"
            >
              Try Your Recipe
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md rounded-b-xl">
            <Link
              href="/"
              className="block text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
              aria-label="Home Page"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-slate-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
              aria-label="About Us Page"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/"
              className="block border border-slate-600 text-slate-600 px-4 py-2 rounded-md text-base font-semibold shadow transition-colors mt-2 bg-transparent hover:bg-slate-50"
              aria-label="Try your own recipe"
              onClick={() => setMenuOpen(false)}
            >
              Try Your Recipe
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
