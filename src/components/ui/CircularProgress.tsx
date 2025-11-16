/**
 * Circular Progress Component
 *
 * Circular progress indicator with smooth animations
 */

import { useTheme } from '@/hooks';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  /**
   * Progress value (0-100)
   */
  progress: number;

  /**
   * Size of the circle
   * @default 100
   */
  size?: number;

  /**
   * Stroke width
   * @default 10
   */
  strokeWidth?: number;

  /**
   * Color of the progress
   */
  color?: string;

  /**
   * Background color of the track
   */
  backgroundColor?: string;

  /**
   * Show percentage text
   * @default true
   */
  showText?: boolean;

  /**
   * Custom text to display
   */
  text?: string;
}

export function CircularProgress({
  progress,
  size = 100,
  strokeWidth = 10,
  color,
  backgroundColor,
  showText = true,
  text,
}: CircularProgressProps) {
  const { colors } = useTheme();
  const progressValue = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    progressValue.value = withTiming(clampedProgress / 100, { duration: 500 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progressValue.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor || colors.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color || colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Text */}
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.text, { color: colors.text }]}>
            {text || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
