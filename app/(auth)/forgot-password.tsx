import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, Container, Button, Input } from '@/components';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas';
import { useTheme, useI18n } from '@/hooks';

export default function ForgotPasswordScreen() {
  const { signIn, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: data.email,
      });

      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAvoiding>
      <Container className="py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            {t('auth.forgotPassword')}
          </Text>
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View className="mb-6">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.enterEmail')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
        </View>

        <Button fullWidth onPress={handleSubmit(onSubmit)} loading={loading} className="mb-4">
          {t('auth.resetPassword')}
        </Button>

        <View className="flex-row justify-center items-center">
          <Text style={{ color: colors.textSecondary }}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-primary-500 font-semibold">{t('auth.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Screen>
  );
}
