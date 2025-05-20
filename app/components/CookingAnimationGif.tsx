import Image from "next/image";

interface CookingAnimationGifProps {
  animationType: string;
  isPaused: boolean;
}

// Map animation types to their corresponding GIF files
const gifMap: Record<string, string> = {
  cutting: "/animations/gif/cutting.gif",
  stirring: "/animations/gif/stirring.gif",
  waiting: "/animations/gif/waiting.gif",
  heating: "/animations/gif/heating.gif",
  mixing: "/animations/gif/mixing.gif",
  pouring: "/animations/gif/pouring.gif",
  seasoning: "/animations/gif/seasoning.gif",
  whisking: "/animations/gif/whisking.gif",
  kneading: "/animations/gif/kneading.gif",
  rolling: "/animations/gif/rolling.gif",
  grating: "/animations/gif/grating.gif",
  peeling: "/animations/gif/peeling.gif",
  folding: "/animations/gif/folding.gif",
  sauteing: "/animations/gif/sauteing.gif",
  cooling: "/animations/gif/cooling.gif",
  blending: "/animations/gif/blending.gif",
  steaming: "/animations/gif/steaming.gif",
  mashing: "/animations/gif/mashing.gif",
  straining: "/animations/gif/straining.gif",
  measuring: "/animations/gif/measuring.gif",
  sifting: "/animations/gif/sifting.gif",
  beating: "/animations/gif/beating.gif",
  crushing: "/animations/gif/crushing.gif",
  shredding: "/animations/gif/shredding.gif",
  juicing: "/animations/gif/juicing.gif",
  serving: "/animations/gif/serving.gif",
};

export default function CookingAnimationGif({
  animationType,
  isPaused,
}: CookingAnimationGifProps) {
  const gifPath = gifMap[animationType] || gifMap.waiting;

  return (
    <div className="w-full h-full relative">
      <Image
        src={gifPath}
        alt={`${animationType} animation`}
        width={200}
        height={200}
        className={`w-full h-full object-contain ${
          isPaused ? "animate-pause" : ""
        }`}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      />
    </div>
  );
}
