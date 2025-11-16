/**
 * Skeleton Templates
 *
 * Pre-built skeleton loaders for common layouts
 */

import { StyleSheet, View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

/**
 * List Item Skeleton
 */
export function SkeletonListItem() {
  return (
    <View style={styles.listItem}>
      <SkeletonLoader variant="circle" width={48} height={48} />
      <View style={styles.listItemContent}>
        <SkeletonLoader width="60%" height={16} borderRadius={4} />
        <View style={styles.spacing} />
        <SkeletonLoader width="40%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

/**
 * Card Skeleton
 */
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.cardContent}>
        <SkeletonLoader width="80%" height={20} borderRadius={4} />
        <View style={styles.spacing} />
        <SkeletonLoader width="100%" height={16} borderRadius={4} />
        <View style={styles.spacing} />
        <SkeletonLoader width="90%" height={16} borderRadius={4} />
        <View style={styles.spacing} />
        <View style={styles.row}>
          <SkeletonLoader width={80} height={32} borderRadius={8} />
          <SkeletonLoader width={80} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}

/**
 * Profile Header Skeleton
 */
export function SkeletonProfileHeader() {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.profileTop}>
        <SkeletonLoader variant="circle" width={80} height={80} />
        <View style={styles.profileStats}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.statItem}>
              <SkeletonLoader width={40} height={20} borderRadius={4} />
              <View style={styles.smallSpacing} />
              <SkeletonLoader width={60} height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.spacing} />
      <SkeletonLoader width="50%" height={18} borderRadius={4} />
      <View style={styles.smallSpacing} />
      <SkeletonLoader width="70%" height={14} borderRadius={4} />
      <View style={styles.spacing} />
      <SkeletonLoader width="100%" height={40} borderRadius={8} />
    </View>
  );
}

/**
 * Feed Item Skeleton
 */
export function SkeletonFeedItem() {
  return (
    <View style={styles.feedItem}>
      {/* Header */}
      <View style={styles.feedHeader}>
        <SkeletonLoader variant="circle" width={40} height={40} />
        <View style={styles.feedHeaderContent}>
          <SkeletonLoader width={120} height={16} borderRadius={4} />
          <View style={styles.smallSpacing} />
          <SkeletonLoader width={80} height={12} borderRadius={4} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.feedContent}>
        <SkeletonLoader width="100%" height={16} borderRadius={4} />
        <View style={styles.smallSpacing} />
        <SkeletonLoader width="90%" height={16} borderRadius={4} />
        <View style={styles.spacing} />
        <SkeletonLoader width="100%" height={300} borderRadius={12} />
      </View>

      {/* Actions */}
      <View style={styles.feedActions}>
        {[1, 2, 3].map((i) => (
          <SkeletonLoader key={i} width={60} height={32} borderRadius={8} />
        ))}
      </View>
    </View>
  );
}

/**
 * Grid Item Skeleton
 */
export function SkeletonGridItem() {
  return (
    <View style={styles.gridItem}>
      <SkeletonLoader width="100%" height={150} borderRadius={8} />
      <View style={styles.smallSpacing} />
      <SkeletonLoader width="80%" height={14} borderRadius={4} />
      <View style={styles.smallSpacing} />
      <SkeletonLoader width="50%" height={12} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  listItemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  profileHeader: {
    padding: 16,
  },
  profileTop: {
    flexDirection: 'row',
    gap: 16,
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  feedItem: {
    padding: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  feedHeaderContent: {
    flex: 1,
  },
  feedContent: {
    marginBottom: 12,
  },
  feedActions: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    margin: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  spacing: {
    height: 12,
  },
  smallSpacing: {
    height: 6,
  },
});
