import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/forms/ActionButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/theme/colors';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  async function submitLogout() {
    await logout();
    router.replace('/(auth)/login');
  }

  return (
    <AppScreen>
      <AppHeader eyebrow="Configuracoes" title="Conta" />
      <View style={styles.card}>
        <Text style={styles.title}>{user?.name ?? 'Usuario'}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Sessao</Text>
        <Text style={styles.meta}>Encerre o acesso atual neste dispositivo.</Text>
        <ActionButton label="Sair" variant="secondary" onPress={submitLogout} />
      </View>
      <Text style={styles.version}>Jera Mobile 0.1.0</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
  },
  version: {
    color: colors.textSubtle,
    textAlign: 'center',
  },
});
