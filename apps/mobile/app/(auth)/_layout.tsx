import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';

export default function AuthLayout() {
  const { user, bootstrapping } = useAuth();

  if (!bootstrapping && user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
  );
}
