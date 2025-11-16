/**
 * Date Picker Component
 *
 * Date picker with bottom sheet UI
 */

import { useTheme } from '@/hooks';
import DateTimePicker from '@react-native-community/datetimepicker';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

interface DatePickerProps {
  /**
   * Label
   */
  label?: string;

  /**
   * Selected date
   */
  value?: Date;

  /**
   * On date change callback
   */
  onChange: (date: Date) => void;

  /**
   * Minimum date
   */
  minimumDate?: Date;

  /**
   * Maximum date
   */
  maximumDate?: Date;

  /**
   * Date format
   * @default 'MMM dd, yyyy'
   */
  dateFormat?: string;

  /**
   * Placeholder
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

export function DatePicker({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  dateFormat = 'MMM dd, yyyy',
  placeholder = 'Select date',
  error,
  disabled = false,
}: DatePickerProps) {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const [tempDate, setTempDate] = useState(value || new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      if (Platform.OS === 'ios') {
        bottomSheetRef.current?.expand();
        setIsOpen(true);
      }
    }
  };

  const handleClose = () => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onChange(tempDate);
    handleClose();
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (Platform.OS === 'android') {
        onChange(selectedDate);
      } else {
        setTempDate(selectedDate);
      }
    }
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.input,
          {
            borderColor: error ? '#ef4444' : isOpen ? colors.primary : colors.border,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.inputText,
            { color: value ? colors.text : colors.textSecondary },
          ]}
        >
          {value ? format(value, dateFormat) : placeholder}
        </Text>
        <Text style={{ color: colors.textSecondary }}>📅</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {Platform.OS === 'ios' ? (
        <GorhomBottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={['auto']}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: colors.card }}
          handleIndicatorStyle={{ backgroundColor: colors.border }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant={colors.isDark ? 'dark' : 'light'}
            />
            <View style={styles.buttons}>
              <View style={styles.buttonHalf}>
                <Button variant="outline" onPress={handleClose}>
                  Cancel
                </Button>
              </View>
              <View style={styles.buttonHalf}>
                <Button variant="primary" onPress={handleConfirm}>
                  Confirm
                </Button>
              </View>
            </View>
          </BottomSheetView>
        </GorhomBottomSheet>
      ) : (
        isOpen && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
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
  input: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  inputText: {
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
  sheetContent: {
    paddingBottom: 32,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  buttonHalf: {
    flex: 1,
  },
});
