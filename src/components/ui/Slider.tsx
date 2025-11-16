/**
 * Slider Component
 *
 * Animated slider with haptic feedback and snap points
 */

import { useHaptics, useTheme } from '@/hooks';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface SliderProps {
  /**
   * Minimum value
   * @default 0
   */
  min?: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Current value
   */
  value: number;

  /**
   * On value change callback
   */
  onValueChange: (value: number) => void;

  /**
   * Step increment
   * @default 1
   */
  step?: number;

  /**
   * Show value label
   * @default true
   */
  showValue?: boolean;

  /**
   * Custom value formatter
   */
  formatValue?: (value: number) => string;

  /**
   * Disabled
   */
  disabled?: boolean;
}

export function Slider({
  min = 0,
  max = 100,
  value,
  onValueChange,
  step = 1,
  showValue = true,
  formatValue,
  disabled = false,
}: SliderProps) {
  const { colors } = useTheme();
  const { selection } = useHaptics();
  const position = useSharedValue(0);
  const sliderWidth = useSharedValue(0);
  const lastValue = useSharedValue(value);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(sliderWidth.value, event.x));
      position.value = newPosition;

      const percentage = newPosition / sliderWidth.value;
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;

      if (steppedValue !== lastValue.value) {
        runOnJS(selection)();
        runOnJS(onValueChange)(steppedValue);
        lastValue.value = steppedValue;
      }
    })
    .onEnd(() => {
      const percentage = position.value / sliderWidth.value;
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const finalPosition = ((steppedValue - min) / (max - min)) * sliderWidth.value;
      position.value = withSpring(finalPosition);
    });

  const trackFillStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const handleLayout = (event: any) => {
    const width = event.nativeEvent.layout.width;
    sliderWidth.value = width;
    const percentage = (value - min) / (max - min);
    position.value = percentage * width;
  };

  return (
    <View style={styles.container}>
      {showValue && (
        <Text style={[styles.value, { color: colors.text }]}>
          {formatValue ? formatValue(value) : value}
        </Text>
      )}

      <GestureDetector gesture={panGesture}>
        <View
          style={[styles.track, { backgroundColor: colors.surface }]}
          onLayout={handleLayout}
        >
          <Animated.View
            style={[
              styles.trackFill,
              { backgroundColor: colors.primary },
              trackFillStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
              },
              thumbStyle,
            ]}
          />
        </View>
      </GestureDetector>

      <View style={styles.labels}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatValue ? formatValue(min) : min}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatValue ? formatValue(max) : max}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  trackFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -10,
    marginLeft: -12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
  },
});
