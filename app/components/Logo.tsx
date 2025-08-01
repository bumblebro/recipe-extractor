import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      {/* <div className="relative w-44 h-12">
        <Image
          src="/favicon.png"
          alt="GuideMyRecipe Logo"
          width={100}
          height={100}
          className="w-full h-full object-cover"
          priority
        />
      </div> */}
      <span className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent group-hover:from-slate-700 group-hover:to-slate-900 transition-all">
        GuideMyRecipe
      </span>
    </Link>
  );
}
