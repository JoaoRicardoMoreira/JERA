import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { TransactionListItem } from '@/components/lists/TransactionListItem';
import { ExpenseFormSheet } from '@/features/transactions/components/ExpenseFormSheet';
import {
  useDeleteTransaction,
  useMonthlySummary,
  useTransactions,
} from '@/features/transactions/hooks/useFinanceQueries';
import { currentPeriod, periodLabel } from '@/lib/dates/format';
import { formatCurrency } from '@/lib/money/format';
import { colors } from '@/theme/colors';

const period = currentPeriod();

export default function ExpensesScreen() {
  const [open, setOpen] = useState(false);
  const summary = useMonthlySummary(period.month, period.year);
  const expenses = useTransactions(period.month, period.year, 'EXPENSE');
  const remove = useDeleteTransaction(period.month, period.year, 'EXPENSE');
  const breakdown = useMemo(() => {
    const items = expenses.data ?? [];
    const total = items.reduce((sum, item) => sum + item.valor, 0);
    const grouped = items.reduce<Record<string, number>>((acc, item) => {
      const key = item.categoria || 'Sem categoria';
      acc[key] = (acc[key] ?? 0) + item.valor;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  }, [expenses.data]);

  return (
    <AppScreen>
      <AppHeader
        eyebrow={`Gastos · ${periodLabel(period.month, period.year)}`}
        title={summary.data ? `- ${formatCurrency(summary.data.totalExpense)}` : undefined}
        action={<ActionButton label="+ Novo" variant="secondary" onPress={() => setOpen(true)} />}
      />
      {breakdown.length ? (
        <View style={styles.breakdown}>
          <Text style={styles.sectionTitle}>Por categoria</Text>
          {breakdown.map((item) => (
            <View key={item.category} style={styles.categoryRow}>
              <View style={styles.categoryTop}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <Text style={styles.categoryValue}>
                  {formatCurrency(item.amount)} · {item.percentage}%
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.bar, { width: `${item.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
      ) : null}
      {expenses.isLoading ? <LoadingState label="Carregando gastos..." /> : null}
      {expenses.error ? <ErrorState message="Nao foi possivel carregar os gastos." /> : null}
      {expenses.data?.length === 0 ? <EmptyState label="Nenhum gasto neste periodo." /> : null}
      {expenses.data?.map((item) => (
        <TransactionListItem key={item.id} item={item} onDelete={() => remove.mutate(item.id)} />
      ))}
      <ExpenseFormSheet
        open={open}
        month={period.month}
        year={period.year}
        onClose={() => setOpen(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  breakdown: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.4,
    textTransform: 'uppercase',
  },
  categoryRow: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: colors.text,
    fontWeight: '800',
  },
  categoryValue: {
    color: colors.textMuted,
  },
  track: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 999,
    height: 4,
  },
  bar: {
    backgroundColor: colors.textMuted,
    borderRadius: 999,
    height: 4,
  },
});
