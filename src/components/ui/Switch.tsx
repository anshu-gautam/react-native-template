/**
 * Switch Component
 *
 * Animated toggle switch with haptic feedback
 */

import { useHaptics, useTheme } from '@/hooks';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Switch({ value, onValueChange, disabled = false, size = 'md' }: SwitchProps) {
  const { colors } = useTheme();
  const { selection } = useHaptics();
  const progress = useSharedValue(value ? 1 : 0);

  const handlePress = () => {
    if (!disabled) {
      selection();
      const newValue = !value;
      onValueChange(newValue);
      progress.value = withSpring(newValue ? 1 : 0, { damping: 15 });
    }
  };

  const sizes = {
    sm: { width: 40, height: 24, thumb: 18 },
    md: { width: 51, height: 31, thumb: 27 },
    lg: { width: 62, height: 38, thumb: 34 },
  };

  const currentSize = sizes[size];

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.surface, colors.primary]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: progress.value * (currentSize.width - currentSize.thumb - 4),
      },
    ],
  }));

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={disabled && styles.disabled}>
      <Animated.View
        style={[
          styles.track,
          {
            width: currentSize.width,
            height: currentSize.height,
            borderColor: colors.border,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: currentSize.thumb,
              height: currentSize.thumb,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 100,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#ffffff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
});
