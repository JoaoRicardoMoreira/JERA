import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.income} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <View style={[styles.box, styles.error]}>
      <Text style={[styles.text, styles.errorText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    padding: 18,
  },
  text: {
    color: colors.textSubtle,
    textAlign: 'center',
  },
  error: {
    backgroundColor: 'rgba(251, 113, 133, 0.1)',
    borderColor: 'rgba(251, 113, 133, 0.45)',
  },
  errorText: {
    color: '#fecdd3',
  },
});
