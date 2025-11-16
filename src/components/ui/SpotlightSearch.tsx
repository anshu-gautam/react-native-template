/**
 * Spotlight Search Component
 *
 * iOS Spotlight-style search overlay with fuzzy search
 */

import { useTheme } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  category?: string;
  onPress: () => void;
}

interface SpotlightSearchProps {
  /**
   * Visible
   */
  visible: boolean;

  /**
   * On close callback
   */
  onClose: () => void;

  /**
   * Search results
   */
  results: SearchResult[];

  /**
   * On search callback
   */
  onSearch: (query: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Recent searches
   */
  recentSearches?: string[];

  /**
   * On clear recent searches
   */
  onClearRecent?: () => void;
}

export function SpotlightSearch({
  visible,
  onClose,
  results,
  onSearch,
  placeholder = 'Search...',
  recentSearches = [],
  onClearRecent,
}: SpotlightSearchProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 15 });
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.95, { duration: 200 });
      setQuery('');
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleResultPress = (result: SearchResult) => {
    result.onPress();
    onClose();
  };

  const groupedResults = results.reduce(
    (acc, result) => {
      const category = result.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          style={[
            styles.content,
            {
              marginTop: insets.top + 40,
              backgroundColor: colors.card,
            },
            contentStyle,
          ]}
        >
          {/* Search Input */}
          <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={handleSearch}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }]}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => handleSearch('')} style={styles.clearButton}>
                <Text style={{ color: colors.textSecondary }}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Results */}
          <View style={styles.resultsContainer}>
            {query.length === 0 && recentSearches.length > 0 ? (
              // Recent Searches
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    Recent
                  </Text>
                  {onClearRecent && (
                    <Pressable onPress={onClearRecent}>
                      <Text style={[styles.clearText, { color: colors.primary }]}>
                        Clear
                      </Text>
                    </Pressable>
                  )}
                </View>
                {recentSearches.map((search, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSearch(search)}
                    style={styles.recentItem}
                  >
                    <Text style={styles.recentIcon}>🕐</Text>
                    <Text style={[styles.recentText, { color: colors.text }]}>
                      {search}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              // Search Results
              <FlatList
                data={Object.entries(groupedResults)}
                keyExtractor={([category]) => category}
                renderItem={({ item: [category, items] }) => (
                  <View>
                    <Text style={[styles.categoryTitle, { color: colors.textSecondary }]}>
                      {category}
                    </Text>
                    {items.map((result) => (
                      <Pressable
                        key={result.id}
                        onPress={() => handleResultPress(result)}
                        style={[
                          styles.resultItem,
                          { borderBottomColor: colors.border },
                        ]}
                      >
                        {result.icon && (
                          <View style={styles.resultIcon}>{result.icon}</View>
                        )}
                        <View style={styles.resultContent}>
                          <Text style={[styles.resultTitle, { color: colors.text }]}>
                            {result.title}
                          </Text>
                          {result.subtitle && (
                            <Text
                              style={[
                                styles.resultSubtitle,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {result.subtitle}
                            </Text>
                          )}
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                      No results found
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
  },
  content: {
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    maxHeight: 400,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
