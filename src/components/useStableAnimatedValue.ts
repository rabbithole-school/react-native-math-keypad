import { useState } from "react";
import { Animated } from "react-native";

/**
 * One Animated.Value for the component's lifetime. React Native's own
 * `useAnimatedValue` does the same, but react-native-web does not export it,
 * so calling it crashed every keypad rendered on the web.
 */
export function useStableAnimatedValue(initialValue: number): Animated.Value {
  const [value] = useState(() => new Animated.Value(initialValue));
  return value;
}
