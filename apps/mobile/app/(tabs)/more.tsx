import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import jeraLogo from '../../src/assets/brand/jera-logo.png';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { colors } from '@/theme/colors';

export default function MoreScreen() {
  return (
    <AppScreen>
      <AppHeader eyebrow="Jera" title="Mais" />
      <Image source={jeraLogo} resizeMode="contain" style={styles.logo} />
      <View style={styles.list}>
        <Pressable style={styles.item} onPress={() => router.push('/investments')}>
          <Text style={styles.title}>Investimentos</Text>
          <Text style={styles.meta}>Aportes, taxa mensal e patrimonio estimado</Text>
        </Pressable>
        <Pressable style={styles.item} onPress={() => router.push('/settings')}>
          <Text style={styles.title}>Configuracoes</Text>
          <Text style={styles.meta}>Conta e sessao deste dispositivo</Text>
        </Pressable>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: 'center',
    height: 76,
    width: 240,
  },
  list: {
    gap: 12,
  },
  item: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
    marginTop: 6,
  },
});
