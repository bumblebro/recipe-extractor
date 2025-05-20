import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CookingAnimation3D from "./CookingAnimation3D";

interface Ingredient {
  name: string;
  quantity?: number;
  unit?: string;
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
    | "sauteing";
  notes?: string;
}

interface CookingAnimationProps {
  instructions: string[];
  onStepComplete: (stepIndex: number) => void;
}

export default function CookingAnimation({
  instructions,
  onStepComplete,
}: CookingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [processedSteps, setProcessedSteps] = useState<ProcessedInstruction[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStepComplete, setIsStepComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processInstructions = async () => {
      setIsProcessing(true);
      try {
        const response = await fetch("/api/process-recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instructions }),
        });
        const data = await response.json();
        setProcessedSteps(data.processedInstructions);
      } catch (error) {
        console.error("Error processing instructions:", error);
        setProcessedSteps(
          instructions.map((instruction) => ({
            action: instruction,
            animationType: determineAnimationType(instruction),
          }))
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processInstructions();
  }, [instructions]);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isPaused && timeRemaining !== null && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            setIsStepComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, isPaused, timeRemaining]);

  const startStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    const duration = getDurationInSeconds(processedSteps[stepIndex]);
    setTimeRemaining(duration || null);
    setIsPaused(false);
    setIsStepComplete(false);
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
        <p className="text-gray-600">Processing recipe instructions...</p>
        <p className="text-sm text-gray-500">This may take a few moments</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Kitchen Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Follow along with your recipe step by step
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => startStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || timeRemaining !== null}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:bg-gray-600 flex items-center gap-2"
              aria-label="Go to previous step"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous Step
            </button>
            <button
              onClick={() => {
                if (isStepComplete || timeRemaining === null) {
                  startStep(
                    Math.min(processedSteps.length - 1, currentStep + 1)
                  );
                  onStepComplete(currentStep);
                }
              }}
              disabled={
                currentStep === processedSteps.length - 1 ||
                (timeRemaining !== null && !isStepComplete)
              }
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
              aria-label={
                timeRemaining !== null && !isStepComplete
                  ? "Waiting for step to complete"
                  : "Go to next step"
              }
            >
              {timeRemaining !== null && !isStepComplete ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Waiting...
                </>
              ) : (
                <>
                  Next Step
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
              aria-label={isPaused ? "Resume cooking" : "Pause cooking"}
            >
              {isPaused ? (
                <>
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
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Resume
                </>
              ) : (
                <>
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
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pause
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-blue-50 p-4 rounded-xl h-48 w-48 relative">
              <CookingAnimation3D
                animationType={
                  processedSteps[currentStep]?.animationType || "waiting"
                }
                isPaused={isPaused}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-center">
                <span className="text-sm font-medium text-gray-700">
                  {processedSteps[currentStep]?.animationType
                    ? processedSteps[currentStep].animationType
                        .charAt(0)
                        .toUpperCase() +
                      processedSteps[currentStep].animationType.slice(1)
                    : "Waiting"}
                </span>
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  aria-label={`Step ${currentStep + 1} of ${
                    processedSteps.length
                  }`}
                >
                  Step {currentStep + 1} of {processedSteps.length}
                </span>
                {timeRemaining !== null && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
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
              <h3 className="text-2xl font-semibold text-gray-800">
                {processedSteps[currentStep]?.action}
              </h3>
              {processedSteps[currentStep]?.ingredients && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Ingredients Needed
                  </h4>
                  <ul className="space-y-2">
                    {processedSteps[currentStep].ingredients.map(
                      (ingredient, index) => (
                        <li
                          key={index}
                          className="text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          {ingredient.quantity && (
                            <span className="font-medium">
                              {ingredient.quantity}
                            </span>
                          )}
                          {ingredient.unit && (
                            <span className="text-gray-500 ml-1">
                              {ingredient.unit}
                            </span>
                          )}
                          <span className="ml-1">{ingredient.name}</span>
                          {ingredient.preparation && (
                            <span className="text-gray-500 ml-1">
                              ({ingredient.preparation})
                            </span>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
              {processedSteps[currentStep]?.temperature && (
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-500"
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
                  <span className="font-medium">
                    {processedSteps[currentStep].temperature}°
                    {processedSteps[currentStep].temperatureUnit}
                  </span>
                </div>
              )}
              {processedSteps[currentStep]?.notes && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 flex items-start gap-2">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
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
                    <span>{processedSteps[currentStep].notes}</span>
                  </p>
                </div>
              )}
              {timeRemaining !== null && (
                <div className="mt-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="text-4xl font-mono bg-gray-100 px-6 py-3 rounded-lg shadow-inner flex items-center gap-2"
                      aria-label={`Time remaining: ${formatTime(
                        timeRemaining
                      )}`}
                    >
                      <svg
                        className="w-6 h-6 text-gray-500"
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
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {processedSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: currentStep === index ? 1 : 0.6,
              y: 0,
            }}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              currentStep === index
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-200"
            }`}
            role="button"
            tabIndex={0}
            onClick={() => startStep(index)}
            onKeyPress={(e) => e.key === "Enter" && startStep(index)}
            aria-label={`Step ${index + 1}: ${step.action}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <p className="text-lg">{step.action}</p>
                  {step.ingredients && step.ingredients.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {step.ingredients.map((i) => i.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              {index === currentStep && timeRemaining !== null && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatTime(timeRemaining)} remaining
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => startStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0 || timeRemaining !== null}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:bg-gray-600 flex items-center gap-2"
          aria-label="Go to previous step"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous Step
        </button>
        <button
          onClick={() => {
            if (isStepComplete || timeRemaining === null) {
              startStep(Math.min(processedSteps.length - 1, currentStep + 1));
              onStepComplete(currentStep);
            }
          }}
          disabled={
            currentStep === processedSteps.length - 1 ||
            (timeRemaining !== null && !isStepComplete)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
          aria-label={
            timeRemaining !== null && !isStepComplete
              ? "Waiting for step to complete"
              : "Go to next step"
          }
        >
          {timeRemaining !== null && !isStepComplete ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Waiting...
            </>
          ) : (
            <>
              Next Step
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function determineAnimationType(
  instruction: string
): ProcessedInstruction["animationType"] {
  const lowerInstruction = instruction.toLowerCase();

  if (
    lowerInstruction.includes("cut") ||
    lowerInstruction.includes("chop") ||
    lowerInstruction.includes("slice")
  ) {
    return "cutting";
  }
  if (lowerInstruction.includes("stir") || lowerInstruction.includes("mix")) {
    return "stirring";
  }
  if (
    lowerInstruction.includes("heat") ||
    lowerInstruction.includes("cook") ||
    lowerInstruction.includes("boil")
  ) {
    return "heating";
  }
  if (lowerInstruction.includes("pour") || lowerInstruction.includes("add")) {
    return "pouring";
  }
  if (
    lowerInstruction.includes("season") ||
    lowerInstruction.includes("salt") ||
    lowerInstruction.includes("pepper")
  ) {
    return "seasoning";
  }
  if (lowerInstruction.includes("whisk") || lowerInstruction.includes("beat")) {
    return "whisking";
  }
  if (
    lowerInstruction.includes("knead") ||
    lowerInstruction.includes("dough")
  ) {
    return "kneading";
  }
  if (
    lowerInstruction.includes("roll") ||
    lowerInstruction.includes("pastry")
  ) {
    return "rolling";
  }
  if (
    lowerInstruction.includes("grate") ||
    lowerInstruction.includes("shred")
  ) {
    return "grating";
  }
  if (lowerInstruction.includes("peel") || lowerInstruction.includes("skin")) {
    return "peeling";
  }
  if (
    lowerInstruction.includes("fold") ||
    lowerInstruction.includes("incorporate")
  ) {
    return "folding";
  }
  if (
    lowerInstruction.includes("saute") ||
    lowerInstruction.includes("fry") ||
    lowerInstruction.includes("pan-fry")
  ) {
    return "sauteing";
  }
  return "waiting";
}
