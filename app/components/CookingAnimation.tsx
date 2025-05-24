import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import CookingAnimationLottie from "./CookingAnimationLottie";
import { AudioNotifications } from "./AudioNotifications";

interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
  preparation?: string;
}

interface ProcessedInstruction {
  action: string;
  duration?: number;
  durationUnit?: "seconds" | "minutes" | "hours";
  ingredients?: Ingredient[];
  temperature?: number;
  temperatureUnit?: "C" | "F";
  animationType?:
    | "cutting"
    | "stirring"
    | "waiting"
    | "heating"
    | "mixing"
    | "pouring"
    | "seasoning"
    | "whisking"
    | "kneading"
    | "rolling"
    | "grating"
    | "peeling"
    | "folding"
    | "sauteing"
    | "cooling"
    | "blending"
    | "steaming"
    | "mashing"
    | "straining"
    | "measuring"
    | "sifting"
    | "beating"
    | "crushing"
    | "shredding"
    | "juicing"
    | "serving";
  notes?: string;
}

interface RecipeData {
  name: string;
  description: string;
  image?: string | string[];
  ingredients: string[];
  instructions: string[];
  totalTime: string;
  cookTime: string;
  prepTime: string;
  yield: string;
  category: string;
  cuisine: string;
  keywords: string[];
  nutrition: {
    calories?: string;
    proteinContent?: string;
    fatContent?: string;
    carbohydrateContent?: string;
  };
}

interface CookingAnimationProps {
  instructions: string[];
  ingredients: Ingredient[];
  onStepComplete: (stepIndex: number) => void;
  servings?: number;
  onServingsChange?: (servings: number) => void;
  recipeData?: RecipeData;
}

// Add helper function to format quantities as fractions
const formatQuantity = (quantity: number): string => {
  // Handle common fractions
  if (quantity === 0.5) return "1/2";
  if (quantity === 0.25) return "1/4";
  if (quantity === 0.75) return "3/4";
  if (quantity === 0.33) return "1/3";
  if (quantity === 0.67) return "2/3";
  if (quantity === 0.125) return "1/8";
  if (quantity === 0.375) return "3/8";
  if (quantity === 0.625) return "5/8";
  if (quantity === 0.875) return "7/8";

  // Handle mixed numbers (whole number + fraction)
  if (quantity > 1) {
    const whole = Math.floor(quantity);
    const decimal = quantity - whole;

    if (decimal === 0.5) return `${whole} 1/2`;
    if (decimal === 0.25) return `${whole} 1/4`;
    if (decimal === 0.75) return `${whole} 3/4`;
    if (decimal === 0.33) return `${whole} 1/3`;
    if (decimal === 0.67) return `${whole} 2/3`;
    if (decimal === 0.125) return `${whole} 1/8`;
    if (decimal === 0.375) return `${whole} 3/8`;
    if (decimal === 0.625) return `${whole} 5/8`;
    if (decimal === 0.875) return `${whole} 7/8`;
  }

  // For whole numbers, remove decimal places
  if (Number.isInteger(quantity)) return quantity.toString();

  // For other decimals, round to 1 decimal place
  return quantity.toFixed(1);
};

const formatDuration = (duration: string): string => {
  // Remove 'PT' prefix and convert to readable format
  const time = duration.replace("PT", "");

  // Handle hours
  if (time.includes("H")) {
    const hours = time.split("H")[0];
    const minutes = time.split("H")[1]?.replace("M", "") || "0";
    return `${hours}h ${minutes}m`;
  }

  // Handle only minutes
  if (time.includes("M")) {
    const minutes = time.replace("M", "");
    return `${minutes} min`;
  }

  return duration;
};

export default function CookingAnimation({
  instructions,
  ingredients,
  onStepComplete,
  servings = 4,
  onServingsChange,
  recipeData,
}: CookingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [processedSteps, setProcessedSteps] = useState<ProcessedInstruction[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(
    "Setting up the kitchen..."
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const [isChecklistExpanded, setIsChecklistExpanded] = useState(false);
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // Memoize loading messages to prevent recreation on every render
  const loadingMessages = useMemo(
    () => [
      "Setting up the kitchen...",
      "Gathering ingredients...",
      "Preheating the oven...",
      "Sharpening knives...",
      "Washing vegetables...",
      "Measuring ingredients...",
      "Organizing cooking tools...",
      "Reading recipe carefully...",
      "Preparing work station...",
      "Getting everything ready...",
    ],
    []
  );

  useEffect(() => {
    if (isProcessing) {
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setCurrentLoadingMessage(loadingMessages[index]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isProcessing, loadingMessages]);

  useEffect(() => {
    const processInstructions = async () => {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/process-recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instructions, ingredients }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.processedInstructions) {
          throw new Error("Invalid response format from server");
        }

        setProcessedSteps(data.processedInstructions);
      } catch (error) {
        console.error("Error processing instructions:", error);
        setError("Failed to process recipe instructions. Please try again.");
        setProcessedSteps(
          instructions.map((instruction) => ({
            action: instruction,
          }))
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processInstructions();
  }, [instructions, ingredients]);

  const getDurationInSeconds = (
    step: ProcessedInstruction
  ): number | undefined => {
    if (!step.duration) return undefined;

    switch (step.durationUnit) {
      case "minutes":
        return step.duration * 60;
      case "hours":
        return step.duration * 3600;
      default:
        return step.duration;
    }
  };

  const calculateProgress = useCallback(() => {
    if (timeRemaining === null) return 0;
    const step = processedSteps[currentStep];
    const totalDuration = getDurationInSeconds(step);
    if (!totalDuration) return 0;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  }, [timeRemaining, currentStep, processedSteps]);

  const calculateOverallProgress = useCallback(() => {
    // If we're on the last step, return 100%
    if (currentStep === processedSteps.length - 1) {
      return 100;
    }
    const completedCount = Math.min(
      completedSteps.length,
      processedSteps.length
    );
    return (completedCount / processedSteps.length) * 100;
  }, [completedSteps.length, processedSteps.length, currentStep]);

  // Memoize the progress calculation
  const progress = useMemo(() => {
    return calculateProgress();
  }, [calculateProgress]);

  // Memoize the overall progress
  const overallProgress = useMemo(() => {
    return calculateOverallProgress();
  }, [calculateOverallProgress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, store the current time
        lastUpdateTimeRef.current = Date.now();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Tab is visible again, calculate time difference and update timer
        const timeDiff = Math.floor(
          (Date.now() - lastUpdateTimeRef.current) / 1000
        );
        if (timeRemaining !== null && !isPaused) {
          setTimeRemaining((prev) => {
            if (prev === null) return null;
            const newTime = Math.max(0, prev - timeDiff);
            if (newTime === 0) {
              setIsStepComplete(true);
              setIsTimerComplete(true);
              return 0;
            }
            return newTime;
          });
          startTimer();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [timeRemaining, isPaused]);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsStepComplete(true);
          setIsTimerComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!isPaused && timeRemaining !== null && timeRemaining > 0) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentStep, isPaused, timeRemaining]);

  const startStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    const duration = getDurationInSeconds(processedSteps[stepIndex]);
    setTimeRemaining(duration || null);
    setIsPaused(false);
    setIsStepComplete(false);
    lastUpdateTimeRef.current = Date.now();
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNextStep = () => {
    // Stop any ongoing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Add current step to completed steps if not already completed
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });

    // If we're at the last step, mark it as complete and return
    if (currentStep === processedSteps.length - 1) {
      setIsStepComplete(true);
      onStepComplete(currentStep);
      return;
    }

    // Update states in a single batch
    const nextStep = currentStep + 1;
    const duration = getDurationInSeconds(processedSteps[nextStep]);

    // Use a single state update to prevent flickering
    setCurrentStep(nextStep);
    setTimeRemaining(duration || null);
    setIsStepComplete(false);
    setIsTimerComplete(false);
    onStepComplete(currentStep);
  };

  const handleCompleteStep = () => {
    // Stop any ongoing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Update states in a single batch
    setIsStepComplete(true);
    setTimeRemaining(0);
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });

    // If this is the last step, call onStepComplete
    if (currentStep === processedSteps.length - 1) {
      onStepComplete(currentStep);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Memoize the current step's data to prevent unnecessary re-renders
  const currentStepData = useMemo(() => {
    return processedSteps[currentStep];
  }, [processedSteps, currentStep]);

  // Memoize the formatted time
  const formattedTimeRemaining = useMemo(() => {
    return timeRemaining !== null ? formatTime(timeRemaining) : null;
  }, [timeRemaining]);

  // Get all unique ingredients from all steps with their quantities
  const allIngredients = useMemo(() => {
    const ingredients = new Map<string, Ingredient>();
    processedSteps.forEach((step) => {
      step.ingredients?.forEach((ingredient) => {
        // Create a unique key based on name and preparation
        const key = `${ingredient.name}-${ingredient.preparation || ""}`;
        if (!ingredients.has(key)) {
          ingredients.set(key, ingredient);
        } else {
          // If ingredient exists, combine quantities if they have the same unit
          const existing = ingredients.get(key)!;
          if (
            existing.unit === ingredient.unit &&
            existing.quantity &&
            ingredient.quantity
          ) {
            existing.quantity += ingredient.quantity;
          }
        }
      });
    });
    return Array.from(ingredients.values());
  }, [processedSteps]);

  // Get ingredients needed for current step
  const currentStepIngredients = useMemo(() => {
    return new Set(
      processedSteps[currentStep]?.ingredients?.map(
        (i) => `${i.name}-${i.quantity}-${i.unit}`
      ) || []
    );
  }, [currentStep, processedSteps]);

  const toggleIngredient = (ingredient: Ingredient) => {
    const key = `${ingredient.name}-${ingredient.quantity}-${ingredient.unit}`;
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Add serving size change handler
  const handleServingsChange = (multiplier: number) => {
    setServingMultiplier(multiplier);
    onServingsChange?.(Math.round(servings * multiplier));
  };

  // Calculate current servings based on multiplier
  const currentServings = Math.round(servings * servingMultiplier);

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-xl">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Error Processing Recipe
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
            aria-label="Retry processing recipe"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 text-lg font-medium">
          {currentLoadingMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AudioNotifications
        isStepComplete={isStepComplete}
        isTimerComplete={isTimerComplete}
      />
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-8 py-4 sm:py-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
        <div className="mb-4 sm:mb-6 bg-white rounded-xl border border-blue-100 shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 w-full sm:w-48 h-48 relative rounded-lg overflow-hidden">
              <Image
                src={
                  typeof recipeData?.image === "string"
                    ? recipeData.image
                    : Array.isArray(recipeData?.image) &&
                      recipeData.image.length > 0
                    ? recipeData.image[0]
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE44KmlnivuSMU4iWXqP7-M3RQj_k03VLEgg&s"
                }
                alt={recipeData?.name || "Recipe image"}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE44KmlnivuSMU4iWXqP7-M3RQj_k03VLEgg&s";
                }}
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {recipeData?.name || "Recipe"}
              </h1>
              <p className="text-gray-600 mb-4">
                {recipeData?.description || "No description available"}
              </p>
              <div className="flex flex-wrap gap-4">
                {recipeData?.totalTime && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
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
                    <span className="text-sm text-gray-600">
                      Total: {formatDuration(recipeData.totalTime)}
                    </span>
                  </div>
                )}
                {recipeData?.cookTime && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
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
                    <span className="text-sm text-gray-600">
                      Cook: {formatDuration(recipeData.cookTime)}
                    </span>
                  </div>
                )}
                {recipeData?.prepTime && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
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
                    <span className="text-sm text-gray-600">
                      Prep: {formatDuration(recipeData.prepTime)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 bg-white rounded-xl border border-blue-100 shadow-lg p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Servings</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleServingsChange(0.5)}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border-2 transition-colors ${
                    servingMultiplier === 0.5
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"
                  }`}
                  aria-label="Set servings to half"
                >
                  1/2x
                </button>
                <button
                  onClick={() => handleServingsChange(1)}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border-2 transition-colors ${
                    servingMultiplier === 1
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"
                  }`}
                  aria-label="Set servings to original"
                >
                  1x
                </button>
                <button
                  onClick={() => handleServingsChange(2)}
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border-2 transition-colors ${
                    servingMultiplier === 2
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500"
                  }`}
                  aria-label="Set servings to double"
                >
                  2x
                </button>
              </div>
              <span className="text-sm text-gray-500">
                ({currentServings} servings)
              </span>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
          <button
            onClick={() => setIsChecklistExpanded(!isChecklistExpanded)}
            className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-expanded={isChecklistExpanded}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
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
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Recipe Ingredients
                </h3>
                <p className="text-sm text-gray-500 text-start">
                  {checkedIngredients.size} of {allIngredients.length} gathered
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {checkedIngredients.size === allIngredients.length && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  All gathered!
                </span>
              )}
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  isChecklistExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <div
            id="ingredient-checklist"
            className={`transition-all duration-300 ease-in-out ${
              isChecklistExpanded
                ? "max-h-[800px] opacity-100"
                : "max-h-0 opacity-0"
            } overflow-y-auto`}
          >
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-2">
                {allIngredients.map((ingredient) => {
                  const key = `${ingredient.name}-${ingredient.quantity}-${ingredient.unit}`;
                  const isNeededInCurrentStep = currentStepIngredients.has(key);
                  const originalQuantity = ingredient.quantity || 0;
                  const scaledQuantity =
                    originalQuantity * (currentServings / servings);

                  return (
                    <div
                      key={key}
                      className={`group relative flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                        checkedIngredients.has(key)
                          ? "bg-green-50 border border-green-200"
                          : isNeededInCurrentStep
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleIngredient(ingredient)}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          checkedIngredients.has(key)
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 group-hover:border-blue-500"
                        }`}
                      >
                        {checkedIngredients.has(key) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span
                              className={`block text-sm font-medium ${
                                checkedIngredients.has(key)
                                  ? "text-gray-500 line-through"
                                  : "text-gray-700"
                              }`}
                            >
                              {ingredient.name}
                            </span>
                            {ingredient.preparation && (
                              <span className="text-xs text-gray-500">
                                {ingredient.preparation}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {ingredient.quantity && (
                              <span
                                className={`text-sm font-medium ${
                                  checkedIngredients.has(key)
                                    ? "text-gray-500"
                                    : "text-gray-700"
                                }`}
                              >
                                {formatQuantity(scaledQuantity)}
                              </span>
                            )}
                            {ingredient.unit && (
                              <span
                                className={`text-sm ${
                                  checkedIngredients.has(key)
                                    ? "text-gray-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {ingredient.unit}
                              </span>
                            )}
                          </div>
                        </div>
                        {isNeededInCurrentStep &&
                          !checkedIngredients.has(key) && (
                            <div className="mt-1.5">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
                                <svg
                                  className="w-3 h-3"
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
                                Needed now
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-6 bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
          <button
            onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
            className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-expanded={isInstructionsExpanded}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Original Instructions
                </h3>
                <p className="text-sm text-gray-500 text-start">
                  {instructions.length} steps
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                isInstructionsExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out ${
              isInstructionsExpanded
                ? "max-h-[800px] opacity-100"
                : "max-h-0 opacity-0"
            } overflow-y-auto`}
          >
            <div className="p-4 pt-0">
              <div className="space-y-3 pb-2">
                {instructions.map((instruction, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Recipe Progress
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {Math.min(
                completedSteps.length +
                  (currentStep === processedSteps.length - 1 ? 1 : 0),
                processedSteps.length
              )}{" "}
              of {processedSteps.length} steps completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(overallProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Recipe progress: ${Math.round(overallProgress)}%`}
            />
          </div>
          <div className="flex justify-end text-sm text-gray-600">
            <span>{Math.round(overallProgress)}% Complete</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-8 rounded-xl border border-blue-100 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="flex-shrink-0 bg-blue-50 p-3 sm:p-4 rounded-xl h-36 w-36 sm:h-48 sm:w-48 relative">
              <CookingAnimationLottie
                animationType={
                  processedSteps[currentStep]?.animationType || "waiting"
                }
                isPaused={isPaused}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 text-center">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {processedSteps[currentStep]?.animationType
                    ? processedSteps[currentStep].animationType
                        .charAt(0)
                        .toUpperCase() +
                      processedSteps[currentStep].animationType.slice(1)
                    : "Waiting"}
                </span>
              </div>
            </div>
            <div className="flex-grow space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium"
                  aria-label={`Step ${currentStep + 1} of ${
                    processedSteps.length
                  }`}
                >
                  Step {currentStep + 1} of {processedSteps.length}
                </span>
                {timeRemaining !== null && (
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      isPaused
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                    aria-label={
                      isPaused ? "Step is paused" : "Step is in progress"
                    }
                  >
                    {isPaused ? "Paused" : "In Progress"}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {currentStepData?.action}
              </h3>
              {currentStepData?.ingredients && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Ingredients Needed
                  </h4>
                  <ul className="space-y-2">
                    {currentStepData.ingredients.map((ingredient, index) => {
                      const originalQuantity = ingredient.quantity || 0;
                      const scaledQuantity =
                        originalQuantity * (currentServings / servings);
                      const key = `${ingredient.name}-${ingredient.quantity}-${ingredient.unit}`;
                      const isChecked = checkedIngredients.has(key);

                      return (
                        <li
                          key={index}
                          className={`flex items-start gap-2 p-2 rounded-lg transition-colors ${
                            isChecked ? "bg-green-50" : "bg-white"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span
                                  className={`block text-sm font-medium ${
                                    isChecked
                                      ? "text-gray-500 line-through"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {ingredient.name}
                                </span>
                                {ingredient.preparation && (
                                  <span className="text-xs text-gray-500">
                                    {ingredient.preparation}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {ingredient.quantity && (
                                  <span
                                    className={`text-sm font-medium ${
                                      isChecked
                                        ? "text-gray-500"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {formatQuantity(scaledQuantity)}
                                  </span>
                                )}
                                {ingredient.unit && (
                                  <span
                                    className={`text-sm ${
                                      isChecked
                                        ? "text-gray-500"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {ingredient.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {currentStepData?.temperature && (
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base font-medium">
                    {currentStepData.temperature}°
                    {currentStepData.temperatureUnit}
                  </span>
                </div>
              )}
              {currentStepData?.notes && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm sm:text-base text-blue-700 flex items-start gap-2">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{currentStepData.notes}</span>
                  </p>
                </div>
              )}
              {timeRemaining !== null && (
                <div className="mt-4 sm:mt-6 w-full">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div
                      className="text-xl sm:text-4xl font-mono bg-gray-100 px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg shadow-inner flex items-center gap-1.5 sm:gap-2 flex-1"
                      aria-label={`Time remaining: ${formattedTimeRemaining}`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0"
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
                      {formattedTimeRemaining}
                    </div>
                    <button
                      onClick={togglePause}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center gap-1 sm:gap-2 flex-1 justify-center"
                      aria-label={isPaused ? "Resume timer" : "Pause timer"}
                    >
                      {isPaused ? (
                        <>
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm sm:text-base">Resume</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm sm:text-base">Pause</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCompleteStep}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md flex items-center gap-1 sm:gap-2 flex-1 justify-center"
                      aria-label="Complete step"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">Complete</span>
                    </button>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                    <div
                      className="bg-blue-500 h-2 sm:h-2.5 rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${progress}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Step progress: ${Math.round(progress)}%`}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-between gap-2 sm:gap-4 mt-4">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0 || timeRemaining !== null}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:bg-gray-600 flex items-center gap-1 sm:gap-2"
                  aria-label="Go to previous step"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Previous</span>
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={
                    currentStep === processedSteps.length - 1 ||
                    (timeRemaining !== null && !isStepComplete)
                  }
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-1 sm:gap-2 ${
                    currentStep === processedSteps.length - 1
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  aria-label={
                    timeRemaining !== null && !isStepComplete
                      ? "Waiting for step to complete"
                      : currentStep === processedSteps.length - 1
                      ? "Complete recipe"
                      : "Go to next step"
                  }
                >
                  {currentStep === processedSteps.length - 1 ? (
                    <>
                      <span className="text-sm sm:text-base">Complete</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">Next</span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="space-y-2 sm:space-y-3 my-10">
          {processedSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentStep === index ? 1 : 0.6,
                y: 0,
              }}
              className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                currentStep === index
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : completedSteps.includes(index)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
              role="button"
              tabIndex={0}
              onClick={() => startStep(index)}
              onKeyPress={(e) => e.key === "Enter" && startStep(index)}
              aria-label={`Step ${index + 1}: ${step.action}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                      currentStep === index
                        ? "bg-blue-500 text-white"
                        : completedSteps.includes(index)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {completedSteps.includes(index) ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <p className="text-base sm:text-lg">{step.action}</p>
                    {step.ingredients && step.ingredients.length > 0 && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {step.ingredients.map((i) => i.name).join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                {index === currentStep && timeRemaining !== null && (
                  <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 sm:gap-2">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
                    {formattedTimeRemaining} remaining
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
