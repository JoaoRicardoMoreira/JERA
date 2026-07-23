import { Redirect, Tabs } from 'expo-router';

import { LoadingState } from '@/components/feedback/States';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <AppScreen scroll={false} contentStyle={{ flex: 1, justifyContent: 'center' }}>
        <LoadingState label="Restaurando sessao..." />
      </AppScreen>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.income,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: '#090909',
          borderTopColor: colors.border,
          minHeight: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarIcon: () => null }} />
      <Tabs.Screen name="incomes" options={{ title: 'Rendas', tabBarIcon: () => null }} />
      <Tabs.Screen name="expenses" options={{ title: 'Gastos', tabBarIcon: () => null }} />
      <Tabs.Screen name="recurrences" options={{ title: 'Recorrentes', tabBarIcon: () => null }} />
      <Tabs.Screen name="more" options={{ title: 'Mais', tabBarIcon: () => null }} />
    </Tabs>
  );
}
