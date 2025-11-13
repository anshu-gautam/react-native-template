import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, onPress, className = '', style }) => {
  const { colors } = useTheme();

  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`rounded-xl p-4 border ${className}`}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={`rounded-xl p-4 border ${className}`} style={cardStyle}>
      {children}
    </View>
  );
};
