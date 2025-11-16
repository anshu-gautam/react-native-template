/**
 * Collapsible Header Component
 *
 * Header that collapses on scroll with blur effect
 */

import { useTheme } from '@/hooks';
import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CollapsibleHeaderProps {
  /**
   * Header content (expanded state)
   */
  header: ReactNode;

  /**
   * Collapsed header content (sticky)
   */
  collapsedHeader?: ReactNode;

  /**
   * Header height when expanded
   * @default 200
   */
  headerHeight?: number;

  /**
   * Collapsed header height
   * @default 64
   */
  collapsedHeight?: number;

  /**
   * Children (scrollable content)
   */
  children: ReactNode;

  /**
   * Enable blur effect (iOS)
   * @default true
   */
  enableBlur?: boolean;
}

export function CollapsibleHeader({
  header,
  collapsedHeader,
  headerHeight = 200,
  collapsedHeight = 64,
  children,
  enableBlur = true,
}: CollapsibleHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight - collapsedHeight],
      [0, -(headerHeight - collapsedHeight)],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight - collapsedHeight],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity,
    };
  });

  const collapsedHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [headerHeight - collapsedHeight - 50, headerHeight - collapsedHeight],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const blurIntensity = useAnimatedStyle(() => {
    const intensity = interpolate(
      scrollY.value,
      [0, headerHeight - collapsedHeight],
      [0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: intensity / 100,
    };
  });

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View
        style={[
          styles.stickyHeader,
          {
            paddingTop: insets.top,
            height: collapsedHeight + insets.top,
          },
        ]}
      >
        {enableBlur && Platform.OS === 'ios' ? (
          <Animated.View style={[StyleSheet.absoluteFill, blurIntensity]}>
            <BlurView intensity={100} tint={colors.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.card },
              blurIntensity,
            ]}
          />
        )}

        {collapsedHeader && (
          <Animated.View style={collapsedHeaderStyle}>
            {collapsedHeader}
          </Animated.View>
        )}
      </View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
      >
        {children}
      </Animated.ScrollView>

      {/* Expanded Header */}
      <Animated.View
        style={[
          styles.expandedHeader,
          {
            height: headerHeight,
            paddingTop: insets.top,
          },
          headerStyle,
        ]}
        pointerEvents="none"
      >
        {header}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  expandedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
