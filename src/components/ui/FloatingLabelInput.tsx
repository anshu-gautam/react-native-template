/**
 * Floating Label Input
 *
 * Material Design style input with floating label
 */

import { useTheme } from '@/hooks';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const FloatingLabelInput = React.forwardRef<TextInput, FloatingLabelInputProps>(
  ({ label, error, value, containerClassName = '', ...props }, ref) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const labelPosition = useSharedValue(value ? 1 : 0);

    useEffect(() => {
      labelPosition.value = withTiming(isFocused || value ? 1 : 0, { duration: 200 });
    }, [isFocused, value]);

    const labelStyle = useAnimatedStyle(() => {
      const translateY = interpolate(labelPosition.value, [0, 1], [0, -28]);
      const scale = interpolate(labelPosition.value, [0, 1], [1, 0.85]);

      return {
        transform: [{ translateY }, { scale }],
      };
    });

    return (
      <View className={`mb-4 ${containerClassName}`}>
        <View
          style={[
            styles.container,
            {
              borderColor: error
                ? '#ef4444'
                : isFocused
                  ? colors.primary
                  : colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Animated.View style={[styles.labelContainer, labelStyle]} pointerEvents="none">
            <Text
              style={[
                styles.label,
                {
                  color: error
                    ? '#ef4444'
                    : isFocused
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              {label}
            </Text>
          </Animated.View>

          <TextInput
            ref={ref}
            value={value}
            style={[styles.input, { color: colors.text }]}
            placeholderTextColor={colors.textSecondary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    left: 16,
    transformOrigin: 'left center',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
  input: {
    fontSize: 16,
    paddingTop: 12,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});
