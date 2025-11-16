/**
 * Progress Bar Component
 *
 * Linear progress indicator with smooth animations
 */

import { useTheme } from '@/hooks';
import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  /**
   * Progress value (0-100)
   */
  progress: number;

  /**
   * Height of the progress bar
   * @default 8
   */
  height?: number;

  /**
   * Color of the progress bar
   */
  color?: string;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Border radius
   * @default 100
   */
  borderRadius?: number;

  /**
   * Animation type
   * @default 'spring'
   */
  animationType?: 'spring' | 'timing';

  /**
   * Show shimmer animation
   * @default false
   */
  showShimmer?: boolean;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  borderRadius = 100,
  animationType = 'spring',
  showShimmer = false,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const progressValue = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    if (animationType === 'spring') {
      progressValue.value = withSpring(clampedProgress / 100, { damping: 15 });
    } else {
      progressValue.value = withTiming(clampedProgress / 100, { duration: 300 });
    }
  }, [progress, animationType]);

  useEffect(() => {
    if (showShimmer) {
      shimmerPosition.value = withTiming(1, { duration: 1500 }, () => {
        shimmerPosition.value = -1;
        shimmerPosition.value = withTiming(1, { duration: 1500 });
      });
    }
  }, [showShimmer]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPosition.value * 200 }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          borderRadius,
          backgroundColor: backgroundColor || colors.surface,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progress,
          {
            borderRadius,
            backgroundColor: color || colors.primary,
          },
          progressStyle,
        ]}
      >
        {showShimmer && (
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 100,
  },
});
