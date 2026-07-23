import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import jeraLogo from '../../src/assets/brand/jera-logo.png';
import { ErrorState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { TextField } from '@/components/forms/TextField';
import { AppScreen } from '@/components/layout/AppScreen';
import { useAuth } from '@/features/auth/auth-context';
import { normalizeApiError } from '@/lib/api/errors';
import { colors } from '@/theme/colors';

export default function RegisterScreen() {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setLoading(true);
    try {
      await auth.register({ name, email, password });
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      setError(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppScreen contentStyle={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <Image source={jeraLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Criar conta</Text>
          <Text style={styles.title}>Comece agora</Text>
          <View style={styles.form}>
            <TextField label="Nome" value={name} onChangeText={setName} />
            <TextField
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextField label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <ErrorState message={error} /> : null}
            <ActionButton label="Criar conta" loading={loading} onPress={submit} />
            <Link href="/(auth)/login" style={styles.link}>
              Ja tenho conta
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboard: {
    gap: 32,
  },
  logo: {
    alignSelf: 'center',
    height: 70,
    width: 220,
  },
  card: {
    backgroundColor: '#090909',
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 20,
    padding: 24,
  },
  eyebrow: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  form: {
    gap: 16,
  },
  link: {
    color: colors.textMuted,
    paddingTop: 10,
    textAlign: 'center',
  },
});
