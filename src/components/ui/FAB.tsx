/**
 * Floating Action Button (FAB)
 *
 * Material Design FAB with expanding sub-actions
 */

import { useHaptics, useTheme } from '@/hooks';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FABAction {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

interface FABProps {
  /**
   * Main FAB icon
   */
  icon: React.ReactNode;

  /**
   * FAB onPress handler (if no actions)
   */
  onPress?: () => void;

  /**
   * Sub-actions (expanding FAB)
   */
  actions?: FABAction[];

  /**
   * Position
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';

  /**
   * Hide on scroll
   */
  visible?: boolean;

  /**
   * Size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

export function FAB({
  icon,
  onPress,
  actions,
  position = 'bottom-right',
  visible = true,
  size = 'md',
}: FABProps) {
  const { colors } = useTheme();
  const { medium } = useHaptics();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const visibility = useSharedValue(1);

  const sizes = {
    sm: 48,
    md: 56,
    lg: 64,
  };

  const fabSize = sizes[size];

  const handlePress = () => {
    medium();

    if (actions && actions.length > 0) {
      const newExpanded = !expanded;
      setExpanded(newExpanded);
      rotation.value = withSpring(newExpanded ? 45 : 0, { damping: 15 });
    } else {
      scale.value = withSpring(0.9, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      onPress?.();
    }
  };

  const handleActionPress = (action: FABAction) => {
    medium();
    action.onPress();
    setExpanded(false);
    rotation.value = withSpring(0, { damping: 15 });
  };

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: visibility.value,
  }));

  const getPositionStyles = () => {
    const offset = 16;
    const bottom = insets.bottom + offset;

    switch (position) {
      case 'bottom-center':
        return { bottom, alignSelf: 'center' };
      case 'bottom-left':
        return { bottom, left: offset };
      case 'bottom-right':
      default:
        return { bottom, right: offset };
    }
  };

  if (!visible) {
    visibility.value = withTiming(0, { duration: 200 });
  } else {
    visibility.value = withTiming(1, { duration: 200 });
  }

  return (
    <View style={[styles.container, getPositionStyles()]} pointerEvents="box-none">
      {/* Sub-actions */}
      {expanded && actions && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <FABActionItem
              key={index}
              action={action}
              index={index}
              onPress={() => handleActionPress(action)}
            />
          ))}
        </View>
      )}

      {/* Main FAB */}
      <Animated.View style={fabStyle}>
        <Pressable
          onPress={handlePress}
          style={[
            styles.fab,
            {
              width: fabSize,
              height: fabSize,
              backgroundColor: colors.primary,
            },
          ]}
        >
          {icon}
        </Pressable>
      </Animated.View>
    </View>
  );
}

function FABActionItem({
  action,
  index,
  onPress,
}: {
  action: FABAction;
  index: number;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const translateY = useSharedValue(20);

  useState(() => {
    scale.value = withSpring(1, { damping: 15, delay: index * 50 });
    translateY.value = withSpring(0, { damping: 15, delay: index * 50 });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: scale.value,
  }));

  return (
    <Animated.View style={[styles.actionItem, animatedStyle]}>
      <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
      <Pressable
        onPress={onPress}
        style={[styles.actionButton, { backgroundColor: colors.card }]}
      >
        {action.icon}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
  },
  fab: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
