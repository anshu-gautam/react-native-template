/**
 * Checkbox Component
 *
 * Animated checkbox with haptic feedback
 */

import { useHaptics, useTheme } from '@/hooks';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  variant?: 'checkbox' | 'radio';
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  variant = 'checkbox',
}: CheckboxProps) {
  const { colors } = useTheme();
  const { selection } = useHaptics();
  const scale = useSharedValue(1);
  const checkProgress = useSharedValue(checked ? 1 : 0);

  const handlePress = () => {
    if (!disabled) {
      selection();
      onChange(!checked);
      scale.value = withSpring(1.2, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      checkProgress.value = withTiming(checked ? 0 : 1, { duration: 200 });
    }
  };

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: checkProgress.value > 0 ? colors.primary : 'transparent',
    borderColor: checkProgress.value > 0 ? colors.primary : colors.border,
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: checkProgress.value,
    transform: [{ scale: checkProgress.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.box,
          variant === 'radio' && styles.radio,
          animatedBoxStyle,
        ]}
      >
        {variant === 'checkbox' ? (
          <AnimatedSvg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            style={animatedCheckStyle}
          >
            <Path
              d="M13.5 4L6 11.5L2.5 8"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AnimatedSvg>
        ) : (
          <Animated.View
            style={[
              styles.radioInner,
              { backgroundColor: 'white' },
              animatedCheckStyle,
            ]}
          />
        )}
      </Animated.View>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    borderRadius: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: 12,
  },
});
