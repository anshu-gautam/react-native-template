/**
 * Like Button Component
 *
 * Animated heart button with pop effect
 */

import { useHaptics, useTheme } from '@/hooks';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface LikeButtonProps {
  liked: boolean;
  onToggle: (liked: boolean) => void;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function LikeButton({
  liked,
  onToggle,
  count = 0,
  showCount = true,
  size = 'md',
  disabled = false,
}: LikeButtonProps) {
  const { colors } = useTheme();
  const { success } = useHaptics();
  const scale = useSharedValue(1);
  const likeProgress = useSharedValue(liked ? 1 : 0);

  const sizes = {
    sm: 20,
    md: 24,
    lg: 32,
  };

  const iconSize = sizes[size];

  const handlePress = () => {
    if (!disabled) {
      const newLiked = !liked;

      if (newLiked) {
        success();
        // Pop animation
        scale.value = withSequence(
          withSpring(1.3, { damping: 10 }),
          withSpring(1)
        );
        likeProgress.value = withSpring(1, { damping: 10 });
      } else {
        likeProgress.value = withSpring(0);
      }

      onToggle(newLiked);
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => {
    const heartScale = interpolate(
      likeProgress.value,
      [0, 0.5, 1],
      [1, 1.2, 1]
    );

    return {
      transform: [{ scale: scale.value * heartScale }],
    };
  });

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={styles.container}>
      <Animated.Text
        style={[
          animatedHeartStyle,
          { fontSize: iconSize, color: liked ? '#ef4444' : colors.textSecondary },
        ]}
      >
        {liked ? '❤️' : '🤍'}
      </Animated.Text>
      {showCount && count > 0 && (
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
  },
});
