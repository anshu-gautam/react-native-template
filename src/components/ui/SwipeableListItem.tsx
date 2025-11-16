/**
 * Swipeable List Item
 *
 * List item with swipe actions (delete, archive, etc.)
 */

import { useHaptics } from '@/hooks';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface SwipeAction {
  label: string;
  onPress: () => void;
  backgroundColor: string;
  icon?: React.ReactNode;
}

interface SwipeableListItemProps {
  /**
   * Item content
   */
  children: React.ReactNode;

  /**
   * Left swipe actions
   */
  leftActions?: SwipeAction[];

  /**
   * Right swipe actions
   */
  rightActions?: SwipeAction[];

  /**
   * Haptic feedback on reveal
   * @default true
   */
  hapticFeedback?: boolean;
}

export function SwipeableListItem({
  children,
  leftActions = [],
  rightActions = [],
  hapticFeedback = true,
}: SwipeableListItemProps) {
  const { medium } = useHaptics();
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  const SWIPE_THRESHOLD = 80;
  const ACTION_WIDTH = 80;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const maxLeft = leftActions.length * ACTION_WIDTH;
      const maxRight = -rightActions.length * ACTION_WIDTH;

      if (event.translationX > 0 && leftActions.length > 0) {
        translateX.value = Math.min(event.translationX, maxLeft);
      } else if (event.translationX < 0 && rightActions.length > 0) {
        translateX.value = Math.max(event.translationX, maxRight);
      }

      // Haptic feedback when threshold is crossed
      if (hapticFeedback && !hasTriggeredHaptic.value) {
        if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
          runOnJS(medium)();
          hasTriggeredHaptic.value = true;
        }
      }
    })
    .onEnd((event) => {
      hasTriggeredHaptic.value = false;

      if (Math.abs(translateX.value) < SWIPE_THRESHOLD) {
        translateX.value = withSpring(0);
      } else {
        // Snap to action width
        if (translateX.value > 0) {
          translateX.value = withSpring(ACTION_WIDTH * Math.min(leftActions.length, 1));
        } else {
          translateX.value = withSpring(-ACTION_WIDTH * Math.min(rightActions.length, 1));
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionsStyle = useAnimatedStyle(() => ({
    width: Math.max(0, translateX.value),
  }));

  const rightActionsStyle = useAnimatedStyle(() => ({
    width: Math.max(0, -translateX.value),
  }));

  const handleActionPress = (action: SwipeAction) => {
    // Animate item out
    itemHeight.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(action.onPress)();
    });
    translateX.value = withTiming(translateX.value > 0 ? 400 : -400, { duration: 300 });
  };

  const heightStyle = useAnimatedStyle(() => ({
    height: itemHeight.value === 0 ? 0 : undefined,
    opacity: itemHeight.value === 0 ? 0 : 1,
  }));

  return (
    <Animated.View style={[styles.container, heightStyle]}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <Animated.View style={[styles.leftActions, leftActionsStyle]}>
          {leftActions.map((action, index) => (
            <Animated.View
              key={index}
              style={[
                styles.action,
                { backgroundColor: action.backgroundColor, width: ACTION_WIDTH },
              ]}
            >
              {action.icon}
              <Text style={styles.actionText}>{action.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <Animated.View style={[styles.rightActions, rightActionsStyle]}>
          {rightActions.map((action, index) => (
            <Animated.View
              key={index}
              style={[
                styles.action,
                { backgroundColor: action.backgroundColor, width: ACTION_WIDTH },
              ]}
            >
              {action.icon}
              <Text style={styles.actionText}>{action.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    backgroundColor: '#fff',
  },
  leftActions: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  rightActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row-reverse',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
