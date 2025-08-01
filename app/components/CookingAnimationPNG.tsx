import React from "react";
import Image from "next/image";

interface CookingAnimationPNGProps {
  animationType: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const animationTypeToImage: Record<string, string> = {
  cutting: "/animations/png/cutting.png",
  stirring: "/animations/png/stirring.png",
  waiting: "/animations/png/waiting.png",
  heating: "/animations/png/heating.png",
  mixing: "/animations/png/mixing.png",
  pouring: "/animations/png/pouring.png",
  seasoning: "/animations/png/seasoning.png",
  whisking: "/animations/png/whisking.png",
  kneading: "/animations/png/kneading.png",
  rolling: "/animations/png/rolling.png",
  grating: "/animations/png/grating.png",
  peeling: "/animations/png/peeling.png",
  folding: "/animations/png/folding.png",
  sauteing: "/animations/png/sauteing.png",
  cooling: "/animations/png/cooling.png",
  blending: "/animations/png/blending.png",
  steaming: "/animations/png/steaming.png",
  mashing: "/animations/png/mashing.png",
  straining: "/animations/png/straining.png",
  measuring: "/animations/png/measuring.png",
  sifting: "/animations/png/sifting.png",
  beating: "/animations/png/beating.png",
  crushing: "/animations/png/crushing.png",
  shredding: "/animations/png/shredding.png",
  juicing: "/animations/png/juicing.png",
  serving: "/animations/png/serving.png",
};

const CookingAnimationPNG: React.FC<CookingAnimationPNGProps> = ({
  animationType,
  alt = "Cooking animation",
}) => {
  const src =
    animationTypeToImage[animationType] || animationTypeToImage["waiting"];
  return (
    <div className={`w-full h-full relative`}>
      <Image
        src={src}
        alt={alt}
        width={270}
        height={270}
        style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}
        priority={animationType === "waiting"}
      />
    </div>
  );
};

export default CookingAnimationPNG;
