/**
 * Select Component
 *
 * Dropdown select with bottom sheet picker
 */

import { useTheme } from '@/hooks';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  /**
   * Select label
   */
  label?: string;

  /**
   * Options to select from
   */
  options: SelectOption[];

  /**
   * Selected value
   */
  value?: string;

  /**
   * On value change callback
   */
  onValueChange: (value: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Disabled
   */
  disabled?: boolean;
}

export function Select({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
}: SelectProps) {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    if (!disabled) {
      bottomSheetRef.current?.expand();
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  };

  const handleSelect = (option: SelectOption) => {
    onValueChange(option.value);
    handleClose();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleClose}
      />
    ),
    []
  );

  const renderItem = ({ item }: { item: SelectOption }) => (
    <Pressable
      style={[
        styles.option,
        {
          backgroundColor:
            item.value === value ? `${colors.primary}20` : 'transparent',
        },
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.optionText,
          {
            color: item.value === value ? colors.primary : colors.text,
            fontWeight: item.value === value ? '600' : '400',
          },
        ]}
      >
        {item.label}
      </Text>
      {item.value === value && (
        <Text style={{ color: colors.primary }}>✓</Text>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.select,
          {
            borderColor: error
              ? '#ef4444'
              : isOpen
                ? colors.primary
                : colors.border,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.selectText,
            {
              color: selectedOption ? colors.text : colors.textSecondary,
            },
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Text style={{ color: colors.textSecondary }}>▼</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      <GorhomBottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%', '75%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            {label || 'Select an option'}
          </Text>
        </View>
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item) => item.value}
          renderItem={renderItem}
        />
      </GorhomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  select: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  selectText: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
  },
});
