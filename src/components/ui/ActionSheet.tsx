/**
 * Action Sheet Component
 *
 * Bottom sheet with action options
 */

import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/hooks';

export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'primary';
  disabled?: boolean;
}

interface ActionSheetProps {
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelText?: string;
}

export const ActionSheet = forwardRef<GorhomBottomSheet, ActionSheetProps>(
  ({ title, message, options, cancelText = 'Cancel' }, ref) => {
    const { colors } = useTheme();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      []
    );

    const handleOptionPress = (option: ActionSheetOption) => {
      if (!option.disabled) {
        option.onPress();
        (ref as any)?.current?.close();
      }
    };

    const getOptionColor = (variant?: string) => {
      switch (variant) {
        case 'destructive':
          return '#ef4444';
        case 'primary':
          return colors.primary;
        default:
          return colors.text;
      }
    };

    return (
      <GorhomBottomSheet
        ref={ref}
        index={-1}
        snapPoints={['auto']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          {(title || message) && (
            <View style={styles.header}>
              {title && (
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              )}
              {message && (
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {message}
                </Text>
              )}
            </View>
          )}

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  { borderBottomColor: colors.border },
                  index === options.length - 1 && styles.lastOption,
                  option.disabled && styles.disabledOption,
                ]}
                onPress={() => handleOptionPress(option)}
                disabled={option.disabled}
              >
                {option.icon && <View style={styles.optionIcon}>{option.icon}</View>}
                <Text
                  style={[
                    styles.optionText,
                    { color: getOptionColor(option.variant) },
                    option.disabled && styles.disabledText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.surface }]}
            onPress={() => (ref as any)?.current?.close()}
          >
            <Text style={[styles.cancelText, { color: colors.text }]}>{cancelText}</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </GorhomBottomSheet>
    );
  }
);

ActionSheet.displayName = 'ActionSheet';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  disabledOption: {
    opacity: 0.4,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  disabledText: {
    opacity: 0.5,
  },
  cancelButton: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
