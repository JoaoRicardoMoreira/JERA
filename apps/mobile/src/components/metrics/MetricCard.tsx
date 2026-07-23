import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type MetricCardProps = {
  label: string;
  value: string;
  tone?: 'income' | 'expense' | 'investment' | 'neutral';
  meta?: string;
  onPress?: () => void;
};

export function MetricCard({ label, value, meta, tone = 'neutral', onPress }: MetricCardProps) {
  const Component = onPress ? Pressable : View;

  return (
    <Component style={styles.root} onPress={onPress}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, styles[tone]]}>{value}</Text>
      </View>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </Component>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 26,
    padding: 20,
  },
  label: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  neutral: {
    color: colors.text,
  },
  income: {
    color: colors.income,
  },
  expense: {
    color: colors.text,
  },
  investment: {
    color: colors.investment,
  },
  meta: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    color: colors.textSubtle,
    fontSize: 12,
    paddingTop: 14,
  },
});
