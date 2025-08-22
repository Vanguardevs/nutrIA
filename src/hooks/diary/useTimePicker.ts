import { useState, useCallback } from "react";

export function useTimePicker(initialHora: string) {
  const [hora, setHora] = useState(initialHora);
  const [isVisible, setIsVisible] = useState(false);

  const showTimePicker = useCallback(() => setIsVisible(true), []);
  const hideTimePicker = useCallback(() => setIsVisible(false), []);
  const setTime = useCallback((newHora: string) => setHora(newHora), []);

  return { hora, setTime, isVisible, showTimePicker, hideTimePicker };
}
