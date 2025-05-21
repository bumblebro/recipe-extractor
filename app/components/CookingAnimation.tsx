import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import CookingAnimationLottie from "./CookingAnimationLottie";
import { AudioNotifications } from "./AudioNotifications";

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
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(
    "Setting up the kitchen..."
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());

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
          body: JSON.stringify({ instructions }),
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

  const calculateProgress = useCallback(() => {
    if (timeRemaining === null) return 0;
    const step = processedSteps[currentStep];
    const totalDuration = getDurationInSeconds(step);
    if (!totalDuration) return 0;
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  }, [timeRemaining, currentStep, processedSteps]);

  const calculateOverallProgress = useCallback(() => {
    const completedCount = Math.min(
      completedSteps.length,
      processedSteps.length
    );
    return (completedCount / processedSteps.length) * 100;
  }, [completedSteps.length, processedSteps.length]);

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
      <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
        <div className="mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Recipe Progress
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {Math.min(completedSteps.length, processedSteps.length)} of{" "}
              {processedSteps.length} steps completed
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

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Kitchen Dashboard
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Follow along with your recipe step by step
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0 || timeRemaining !== null}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:bg-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base"
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
                <span className="hidden sm:inline">Previous Step</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={
                  currentStep === processedSteps.length - 1 ||
                  (timeRemaining !== null && !isStepComplete)
                }
                className={`px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2 text-sm sm:text-base ${
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
                    <span className="hidden sm:inline">Complete Recipe</span>
                    <span className="sm:hidden">Complete</span>
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
                    <span className="hidden sm:inline">Next Step</span>
                    <span className="sm:hidden">Next</span>
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
                    <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
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
                    <ul className="space-y-1.5 sm:space-y-2">
                      {currentStepData.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-sm sm:text-base text-gray-700 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
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
                      ))}
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
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className="text-2xl sm:text-4xl font-mono bg-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-inner flex items-center gap-2"
                        aria-label={`Time remaining: ${formattedTimeRemaining}`}
                      >
                        <svg
                          className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500 flex-shrink-0"
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
                        className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md flex items-center gap-2"
                        aria-label={isPaused ? "Resume timer" : "Pause timer"}
                      >
                        {isPaused ? (
                          <>
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
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Resume</span>
                          </>
                        ) : (
                          <>
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
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Pause</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCompleteStep}
                        className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md flex items-center gap-2"
                        aria-label="Complete step"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="hidden sm:inline">Complete Step</span>
                        <span className="sm:hidden">Complete</span>
                      </button>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
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
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
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

        <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
          <button
            onClick={handlePreviousStep}
            disabled={currentStep === 0 || timeRemaining !== null}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:bg-gray-600 flex items-center gap-2 text-sm sm:text-base"
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
            <span className="hidden sm:inline">Previous Step</span>
            <span className="sm:hidden">Prev</span>
          </button>
          <button
            onClick={handleNextStep}
            disabled={
              currentStep === processedSteps.length - 1 ||
              (timeRemaining !== null && !isStepComplete)
            }
            className={`px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2 text-sm sm:text-base ${
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
                <span className="hidden sm:inline">Complete Recipe</span>
                <span className="sm:hidden">Complete</span>
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
                <span className="hidden sm:inline">Next Step</span>
                <span className="sm:hidden">Next</span>
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
  );
}
