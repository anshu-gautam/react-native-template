/**
 * Animated Tab Bar Component
 *
 * Tab bar with animated indicator and icon animations
 */

import { useTheme } from '@/hooks';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnimatedTabBarProps {
  /**
   * Tabs
   */
  tabs: Tab[];

  /**
   * Active tab index
   */
  activeIndex: number;

  /**
   * On tab change callback
   */
  onChange: (index: number) => void;

  /**
   * Variant
   * @default 'indicator'
   */
  variant?: 'indicator' | 'pill' | 'bubble';
}

export function AnimatedTabBar({
  tabs,
  activeIndex,
  onChange,
  variant = 'indicator',
}: AnimatedTabBarProps) {
  const { colors } = useTheme();
  const indicatorPosition = useSharedValue(0);
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);

  const handleTabLayout = (index: number, x: number, width: number) => {
    setTabLayouts((prev) => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  const handleTabPress = (index: number) => {
    onChange(index);

    if (tabLayouts[index]) {
      indicatorPosition.value = withSpring(tabLayouts[index].x, { damping: 15 });
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  const activeTabLayout = tabLayouts[activeIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Animated Indicator */}
      {variant === 'indicator' && activeTabLayout && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: activeTabLayout.width,
              backgroundColor: colors.primary,
            },
            indicatorStyle,
          ]}
        />
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            index={index}
            isActive={index === activeIndex}
            variant={variant}
            onPress={() => handleTabPress(index)}
            onLayout={(x, width) => handleTabLayout(index, x, width)}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  index,
  isActive,
  variant,
  onPress,
  onLayout,
}: {
  tab: Tab;
  index: number;
  isActive: boolean;
  variant: string;
  onPress: () => void;
  onLayout: (x: number, width: number) => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(isActive ? 1 : 0);

  const handleLayout = (event: any) => {
    const { x, width } = event.nativeEvent.layout;
    onLayout(x, width);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const iconScale = interpolate(colorProgress.value, [0, 1], [1, 1.2]);

    return {
      transform: [{ scale: scale.value * iconScale }],
    };
  });

  const textStyle = useAnimatedStyle(() => ({
    color: interpolate(
      colorProgress.value,
      [0, 1],
      [colors.textSecondary, colors.primary]
    ) as any,
  }));

  if (isActive) {
    colorProgress.value = withTiming(1, { duration: 200 });
  } else {
    colorProgress.value = withTiming(0, { duration: 200 });
  }

  return (
    <Pressable
      onPress={onPress}
      onLayout={handleLayout}
      style={[
        styles.tab,
        variant === 'pill' && isActive && {
          backgroundColor: `${colors.primary}20`,
          borderRadius: 20,
        },
        variant === 'bubble' && isActive && {
          backgroundColor: colors.primary,
          borderRadius: 20,
        },
      ]}
    >
      {tab.icon && (
        <Animated.View style={animatedStyle}>{tab.icon}</Animated.View>
      )}
      <Animated.Text
        style={[
          styles.tabLabel,
          variant === 'bubble' && isActive && { color: '#fff' },
          !isActive && textStyle,
        ]}
      >
        {tab.label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    height: 3,
    borderRadius: 2,
  },
});
