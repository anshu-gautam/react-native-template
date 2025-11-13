import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen, Container, Button, Input } from '@/components';
import { signInSchema, type SignInInput } from '@/features/auth/schemas';
import { useTheme, useI18n } from '@/hooks';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { t } = useI18n();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInInput) => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      Alert.alert('Error', error.errors?.[0]?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll keyboardAvoiding>
      <Container className="py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            {t('auth.signIn')}
          </Text>
          <Text className="text-base" style={{ color: colors.textSecondary }}>
            Welcome back! Please sign in to continue.
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.enterPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            )}
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text className="text-primary-500 text-sm text-right">
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>
        </View>

        <Button fullWidth onPress={handleSubmit(onSubmit)} loading={loading} className="mb-4">
          {t('auth.signIn')}
        </Button>

        <View className="flex-row justify-center items-center">
          <Text style={{ color: colors.textSecondary }}>{t('auth.dontHaveAccount')} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
            <Text className="text-primary-500 font-semibold">{t('auth.signUp')}</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Screen>
  );
}
