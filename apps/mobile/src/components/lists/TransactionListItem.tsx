import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TransactionViewModel } from '@/features/transactions/types';
import { formatCurrency } from '@/lib/money/format';
import { colors } from '@/theme/colors';

type TransactionListItemProps = {
  item: TransactionViewModel;
  onDelete?: () => void;
};

export function TransactionListItem({ item, onDelete }: TransactionListItemProps) {
  const isIncome = item.type === 'renda';

  return (
    <View style={styles.root}>
      <View style={styles.main}>
        <Text style={styles.date}>
          {new Date(`${item.data}T00:00:00`).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.title}>{item.desc || 'Sem descricao'}</Text>
        <Text style={styles.category}>{item.categoria || 'Sem categoria'}</Text>
      </View>
      <View style={styles.side}>
        <Text style={[styles.value, isIncome ? styles.income : styles.expense]}>
          {isIncome ? '+ ' : '- '}
          {formatCurrency(item.valor)}
        </Text>
        {onDelete ? (
          <Pressable onPress={onDelete}>
            <Text style={styles.delete}>Excluir</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 16,
  },
  main: {
    flex: 1,
    gap: 5,
  },
  date: {
    color: colors.textSubtle,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  category: {
    color: colors.textMuted,
    fontSize: 12,
  },
  side: {
    alignItems: 'flex-end',
    gap: 12,
  },
  value: {
    fontWeight: '800',
  },
  income: {
    color: colors.income,
  },
  expense: {
    color: colors.text,
  },
  delete: {
    color: colors.expense,
    fontSize: 12,
  },
});
