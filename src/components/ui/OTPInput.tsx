/**
 * OTP Input Component
 *
 * One-Time Password input with auto-focus
 */

import { useTheme } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface OTPInputProps {
  /**
   * Number of OTP digits
   * @default 6
   */
  length?: number;

  /**
   * Callback when OTP is complete
   */
  onComplete: (otp: string) => void;

  /**
   * Callback when OTP changes
   */
  onChange?: (otp: string) => void;

  /**
   * Error message
   */
  error?: string;

  /**
   * Auto focus on mount
   * @default true
   */
  autoFocus?: boolean;
}

export function OTPInput({
  length = 6,
  onComplete,
  onChange,
  error,
  autoFocus = true,
}: OTPInputProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useSharedValue(0);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (error) {
      shakeAnimation.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [error]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      // Handle paste
      const digits = text.slice(0, length).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      onChange?.(newOtp.join(''));

      if (newOtp.every((digit) => digit !== '')) {
        onComplete(newOtp.join(''));
      }

      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      onChange?.(newOtp.join(''));

      if (text !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== '')) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCellPress = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  return (
    <View>
      <Animated.View style={[styles.container, shakeStyle]}>
        {otp.map((digit, index) => (
          <Pressable key={index} onPress={() => handleCellPress(index)}>
            <View
              style={[
                styles.cell,
                {
                  borderColor: error
                    ? '#ef4444'
                    : focusedIndex === index
                      ? colors.primary
                      : colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                onFocus={() => setFocusedIndex(index)}
                maxLength={length}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                selectTextOnFocus
                style={[styles.input, { color: colors.text }]}
              />
            </View>
          </Pressable>
        ))}
      </Animated.View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  error: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
