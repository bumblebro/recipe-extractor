import { Metadata } from "next";

const baseUrl = "https://guidemyrecipe.com";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "GuideMyRecipe.com - Your AI-Powered Cooking Assistant",
    template: "%s | GuideMyRecipe.com",
  },
  description:
    "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
  keywords:
    "recipe extractor, cooking assistant, recipe scaling, cooking guide, AI cooking, recipe organization, cooking instructions, recipe converter, cooking helper, recipe management",
  authors: [{ name: "GuideMyRecipe.com" }],
  creator: "GuideMyRecipe.com",
  publisher: "GuideMyRecipe.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "GuideMyRecipe.com",
    title: "GuideMyRecipe.com - Your AI-Powered Cooking Assistant",
    description:
      "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@guidemyrecipe",
    title: "GuideMyRecipe.com - Your AI-Powered Cooking Assistant",
    description:
      "Transform any recipe into an interactive cooking guide. Extract, organize, and follow recipes from any website with our AI-powered cooking assistant.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export function generateMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const pageTitle = title
    ? `${title} | GuideMyRecipe.com`
    : defaultMetadata.title;
  const pageDescription =
    description || (defaultMetadata.description as string);

  return {
    ...defaultMetadata,
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: pageTitle,
      description: pageDescription,
      url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: pageTitle,
      description: pageDescription,
      images: image ? [image] : undefined,
    },
  };
}
