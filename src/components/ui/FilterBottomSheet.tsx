/**
 * Filter Bottom Sheet Component
 *
 * Bottom sheet for filtering with multi-select and range options
 */

import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks';
import { Button } from './Button';
import { Checkbox } from './Checkbox';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'radio';
  options: FilterOption[];
}

interface FilterBottomSheetProps {
  title?: string;
  sections: FilterSection[];
  initialValues?: Record<string, string[]>;
  onApply: (filters: Record<string, string[]>) => void;
  onReset?: () => void;
}

export const FilterBottomSheet = forwardRef<GorhomBottomSheet, FilterBottomSheetProps>(
  ({ title = 'Filters', sections, initialValues = {}, onApply, onReset }, ref) => {
    const { colors } = useTheme();
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(
      initialValues
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    const handleToggleOption = (sectionId: string, optionValue: string, isRadio: boolean) => {
      setSelectedFilters((prev) => {
        const current = prev[sectionId] || [];

        if (isRadio) {
          return { ...prev, [sectionId]: [optionValue] };
        }

        if (current.includes(optionValue)) {
          return { ...prev, [sectionId]: current.filter((v) => v !== optionValue) };
        }

        return { ...prev, [sectionId]: [...current, optionValue] };
      });
    };

    const handleApply = () => {
      onApply(selectedFilters);
      (ref as any)?.current?.close();
    };

    const handleReset = () => {
      setSelectedFilters({});
      onReset?.();
    };

    const getSelectedCount = () => {
      return Object.values(selectedFilters).reduce((acc, arr) => acc + arr.length, 0);
    };

    return (
      <GorhomBottomSheet
        ref={ref}
        index={-1}
        snapPoints={['75%', '90%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {getSelectedCount() > 0 && (
              <Text style={[styles.selectedCount, { color: colors.textSecondary }]}>
                {getSelectedCount()} selected
              </Text>
            )}
          </View>

          {/* Filter Sections */}
          {sections.map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.title}
              </Text>
              {section.options.map((option) => (
                <Checkbox
                  key={option.id}
                  label={option.label}
                  checked={(selectedFilters[section.id] || []).includes(option.value)}
                  onChange={() =>
                    handleToggleOption(section.id, option.value, section.type === 'radio')
                  }
                  variant={section.type === 'radio' ? 'radio' : 'checkbox'}
                />
              ))}
            </View>
          ))}
        </BottomSheetScrollView>

        {/* Footer Buttons */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <Button variant="outline" onPress={handleReset}>
                Reset
              </Button>
            </View>
            <View style={styles.buttonHalf}>
              <Button variant="primary" onPress={handleApply}>
                Apply
              </Button>
            </View>
          </View>
        </View>
      </GorhomBottomSheet>
    );
  }
);

FilterBottomSheet.displayName = 'FilterBottomSheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedCount: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
});
