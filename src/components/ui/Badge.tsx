/**
 * Badge Component
 *
 * Small badge for notifications and counts
 */

import { useTheme } from '@/hooks';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface BadgeProps {
  /**
   * Badge count or text
   */
  value?: number | string;

  /**
   * Show dot only (no text)
   * @default false
   */
  dot?: boolean;

  /**
   * Badge variant
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Position of badge when used as overlay
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Children to wrap badge around
   */
  children?: React.ReactNode;
}

const VARIANT_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export function Badge({
  value,
  dot = false,
  variant = 'primary',
  size = 'md',
  position = 'top-right',
  style,
  children,
}: BadgeProps) {
  const { colors } = useTheme();

  const backgroundColor = VARIANT_COLORS[variant];

  const getSizeStyles = () => {
    if (dot) {
      return {
        sm: { width: 8, height: 8 },
        md: { width: 10, height: 10 },
        lg: { width: 12, height: 12 },
      }[size];
    }

    return {
      sm: { minWidth: 16, height: 16, paddingHorizontal: 4 },
      md: { minWidth: 20, height: 20, paddingHorizontal: 6 },
      lg: { minWidth: 24, height: 24, paddingHorizontal: 8 },
    }[size];
  };

  const getTextSize = () => {
    return {
      sm: 10,
      md: 12,
      lg: 14,
    }[size];
  };

  const getPositionStyles = (): ViewStyle => {
    const offset = {
      sm: -4,
      md: -6,
      lg: -8,
    }[size];

    const positions = {
      'top-right': { top: offset, right: offset },
      'top-left': { top: offset, left: offset },
      'bottom-right': { bottom: offset, right: offset },
      'bottom-left': { bottom: offset, left: offset },
    };

    return positions[position];
  };

  const sizeStyles = getSizeStyles();
  const textSize = getTextSize();

  const formatValue = () => {
    if (typeof value === 'number') {
      return value > 99 ? '99+' : value.toString();
    }
    return value;
  };

  const badgeElement = (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: dot ? 100 : 100,
        },
        sizeStyles,
        children && getPositionStyles(),
        style,
      ]}
    >
      {!dot && value !== undefined && (
        <Text style={[styles.text, { fontSize: textSize }]}>{formatValue()}</Text>
      )}
    </View>
  );

  if (children) {
    return (
      <View style={styles.wrapper}>
        {children}
        {badgeElement}
      </View>
    );
  }

  return badgeElement;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
