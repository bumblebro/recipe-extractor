import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="relative w-8 h-8">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-blue-600 group-hover:text-blue-700 transition-colors"
        >
          {/* Recipe Book */}
          <path d="M4 4h16v16H4V4z" fill="currentColor" fillOpacity="0.1" />
          <path
            d="M4 4h16v16H4V4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Book Pages */}
          <path
            d="M8 8h8M8 12h8M8 16h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Cooking Utensil */}
          <path
            d="M16 4l2-2M16 4l-2-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Cooking Pot */}
          <path
            d="M6 18c0 0 2-1 6-1s6 1 6 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-900 transition-all">
        GuideMyRecipe
      </span>
    </Link>
  );
}
