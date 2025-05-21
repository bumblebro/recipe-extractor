import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface CookingAnimationLottieProps {
  animationType: string;
  isPaused: boolean;
}

interface AnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: unknown[];
  layers: unknown[];
}

// Map animation types to their corresponding Lottie JSON files
const animationMap: Record<string, string> = {
  cutting: "/animations/cutting.json",
  stirring: "/animations/stirring.json",
  waiting: "/animations/waiting.json",
  heating: "/animations/heating.json",
  mixing: "/animations/mixing.json",
  pouring: "/animations/pouring.json",
  seasoning: "/animations/seasoning.json",
  whisking: "/animations/whisking.json",
  kneading: "/animations/kneading.json",
  rolling: "/animations/rolling.json",
  grating: "/animations/grating.json",
  peeling: "/animations/peeling.json",
  folding: "/animations/folding.json",
  sauteing: "/animations/sauteing.json",
  cooling: "/animations/cooling.json",
  blending: "/animations/blending.json",
  steaming: "/animations/steaming.json",
  mashing: "/animations/mashing.json",
  straining: "/animations/straining.json",
  measuring: "/animations/measuring.json",
  sifting: "/animations/sifting.json",
  beating: "/animations/beating.json",
  crushing: "/animations/crushing.json",
  shredding: "/animations/shredding.json",
  juicing: "/animations/juicing.json",
  serving: "/animations/serving.json",
};

export default function CookingAnimationLottie({
  animationType,
  isPaused,
}: CookingAnimationLottieProps) {
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(
          animationMap[animationType] || animationMap.waiting
        );
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading animation:", err);
        setError("Failed to load animation");
        // Load default waiting animation as fallback
        try {
          const fallbackResponse = await fetch(animationMap.waiting);
          const fallbackData = await fallbackResponse.json();
          setAnimationData(fallbackData);
        } catch (fallbackErr) {
          console.error("Error loading fallback animation:", fallbackErr);
        }
      }
    };

    loadAnimation();
  }, [animationType]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {animationData && (
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={!isPaused}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
