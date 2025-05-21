import { useEffect, useRef } from "react";

interface AudioNotificationsProps {
  isStepComplete: boolean;
  isTimerComplete: boolean;
}

export const AudioNotifications = ({
  isStepComplete,
  isTimerComplete,
}: AudioNotificationsProps) => {
  const stepCompleteSound = useRef<HTMLAudioElement | null>(null);
  const timerCompleteSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio elements
    stepCompleteSound.current = new Audio("/sounds/step-complete.mp3");
    timerCompleteSound.current = new Audio("/sounds/timer-alert.mp3");

    // Preload sounds
    stepCompleteSound.current.load();
    timerCompleteSound.current.load();

    return () => {
      // Cleanup
      if (stepCompleteSound.current) {
        stepCompleteSound.current.pause();
        stepCompleteSound.current = null;
      }
      if (timerCompleteSound.current) {
        timerCompleteSound.current.pause();
        timerCompleteSound.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isStepComplete && stepCompleteSound.current) {
      stepCompleteSound.current.play().catch((error) => {
        console.error("Error playing step complete sound:", error);
      });
    }
  }, [isStepComplete]);

  useEffect(() => {
    if (isTimerComplete && timerCompleteSound.current) {
      timerCompleteSound.current.play().catch((error) => {
        console.error("Error playing timer complete sound:", error);
      });
    }
  }, [isTimerComplete]);

  return null; // This component doesn't render anything
};
