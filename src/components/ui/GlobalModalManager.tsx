/**
 * Global Modal Manager
 *
 * Renders all global modals from the modal store
 */

import { useTheme } from '@/hooks';
import { useModalStore } from '@/store/modalStore';
import { useState } from 'react';
import {
  Modal as RNModal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Button } from './Button';

const VARIANT_COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const VARIANT_ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function GlobalModalManager() {
  const { modals, hide } = useModalStore();

  return (
    <>
      {modals.map((modal) => (
        <ModalRenderer key={modal.id} modal={modal} onClose={() => hide(modal.id)} />
      ))}
    </>
  );
}

function ModalRenderer({
  modal,
  onClose,
}: {
  modal: any;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const [inputValue, useState] = useState(modal.inputValue || '');

  const handleConfirm = () => {
    if (modal.type === 'input') {
      modal.onConfirm?.(inputValue);
    } else {
      modal.onConfirm?.();
    }
    onClose();
  };

  const handleCancel = () => {
    modal.onCancel?.();
    onClose();
  };

  const variantColor = modal.variant ? VARIANT_COLORS[modal.variant] : colors.primary;
  const variantIcon = modal.variant ? VARIANT_ICONS[modal.variant] : null;

  return (
    <RNModal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        className="flex-1 bg-black/50 justify-center items-center p-4"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown.springify().damping(20)}
          className="w-full max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.card }}
        >
          {/* Icon */}
          {variantIcon && (
            <View
              className="w-16 h-16 rounded-full items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${variantColor}20` }}
            >
              <Text className="text-3xl" style={{ color: variantColor }}>
                {variantIcon}
              </Text>
            </View>
          )}

          {/* Title */}
          {modal.title && (
            <Text
              className="text-xl font-bold text-center mb-2"
              style={{ color: colors.text }}
            >
              {modal.title}
            </Text>
          )}

          {/* Message */}
          {modal.message && (
            <Text
              className="text-base text-center mb-6"
              style={{ color: colors.textSecondary }}
            >
              {modal.message}
            </Text>
          )}

          {/* Input for input type */}
          {modal.type === 'input' && (
            <TextInput
              className="h-12 px-4 rounded-lg border mb-6"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              }}
              placeholder={modal.inputPlaceholder || 'Enter value...'}
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
            />
          )}

          {/* Custom Component */}
          {modal.type === 'custom' && modal.customComponent && (
            <modal.customComponent onClose={onClose} />
          )}

          {/* Buttons */}
          {modal.type !== 'custom' && (
            <View className="flex-row gap-3">
              {modal.type !== 'alert' && modal.cancelText !== undefined && (
                <View className="flex-1">
                  <Button variant="outline" onPress={handleCancel}>
                    {modal.cancelText || 'Cancel'}
                  </Button>
                </View>
              )}
              <View className="flex-1">
                <Button
                  variant="primary"
                  onPress={handleConfirm}
                  className={modal.variant === 'error' ? 'bg-error-500' : ''}
                >
                  {modal.confirmText || 'OK'}
                </Button>
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}
