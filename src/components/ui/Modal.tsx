import React from 'react';
import {
  View,
  Modal as RNModal,
  TouchableOpacity,
  Text,
  Pressable,
  ModalProps as RNModalProps,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useTheme } from '@/hooks';

interface ModalProps extends Partial<RNModalProps> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...props}
    >
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        <Pressable className="flex-1 w-full" onPress={onClose} />
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          className="w-11/12 max-w-md rounded-2xl p-6"
          style={{ backgroundColor: colors.card }}
        >
          {(title || showCloseButton) && (
            <View className="flex-row justify-between items-center mb-4">
              {title && (
                <Text className="text-xl font-bold" style={{ color: colors.text }}>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} className="p-2">
                  <Text className="text-2xl" style={{ color: colors.textSecondary }}>
                    ×
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {children}
        </Animated.View>
        <Pressable className="flex-1 w-full" onPress={onClose} />
      </Animated.View>
    </RNModal>
  );
};
