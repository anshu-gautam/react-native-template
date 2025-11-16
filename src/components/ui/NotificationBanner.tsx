/**
 * Notification Banner Component
 *
 * In-app notification banner (iOS-style slide-down)
 */

import { useTheme } from '@/hooks';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotificationBannerProps {
  /**
   * Show notification
   */
  visible: boolean;

  /**
   * Notification title
   */
  title: string;

  /**
   * Notification message
   */
  message?: string;

  /**
   * Icon/image
   */
  icon?: React.ReactNode;

  /**
   * Variant
   * @default 'info'
   */
  variant?: 'success' | 'error' | 'warning' | 'info';

  /**
   * On press callback
   */
  onPress?: () => void;

  /**
   * On dismiss callback
   */
  onDismiss?: () => void;

  /**
   * Auto dismiss after duration (ms)
   * @default 3000
   */
  duration?: number;
}

const VARIANT_COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export function NotificationBanner({
  visible,
  title,
  message,
  icon,
  variant = 'info',
  onPress,
  onDismiss,
  duration = 3000,
}: NotificationBannerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-200);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });

      if (duration > 0) {
        const timeout = setTimeout(() => {
          translateY.value = withSpring(-200, { damping: 15 });
          opacity.value = withTiming(0, { duration: 200 }, () => {
            if (onDismiss) {
              runOnJS(onDismiss)();
            }
          });
        }, duration);

        return () => clearTimeout(timeout);
      }
    } else {
      translateY.value = withSpring(-200, { damping: 15 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const variantColor = VARIANT_COLORS[variant];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top,
        },
        animatedStyle,
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.banner,
          {
            backgroundColor: colors.card,
            borderLeftColor: variantColor,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {message && (
            <Text
              style={[styles.message, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {message}
            </Text>
          )}
        </View>

        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.closeButton}>
            <Text style={{ color: colors.textSecondary, fontSize: 20 }}>×</Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
