import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorState, LoadingState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { MetricCard } from '@/components/metrics/MetricCard';
import { useRecurrences } from '@/features/recurrences/recurrences.hooks';
import { ExpenseFormSheet } from '@/features/transactions/components/ExpenseFormSheet';
import { IncomeFormSheet } from '@/features/transactions/components/IncomeFormSheet';
import { useMonthlySummary } from '@/features/transactions/hooks/useFinanceQueries';
import { currentPeriod, dayFromIso, periodLabel } from '@/lib/dates/format';
import { formatCurrency } from '@/lib/money/format';
import { colors } from '@/theme/colors';

const period = currentPeriod();

export default function DashboardScreen() {
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const summary = useMonthlySummary(period.month, period.year);
  const recurrences = useRecurrences();

  return (
    <AppScreen contentStyle={styles.screen} scroll>
      <AppHeader
        eyebrow={`Visao geral · ${periodLabel(period.month, period.year)}`}
        action={
          <ActionButton label="+ Gasto" variant="secondary" onPress={() => setExpenseOpen(true)} />
        }
      />

      {summary.isLoading ? <LoadingState label="Carregando dashboard..." /> : null}
      {summary.error ? <ErrorState message="Nao foi possivel carregar o dashboard." /> : null}

      {summary.data ? (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Saldo disponivel</Text>
            <Text style={styles.heroValue}>{formatCurrency(summary.data.balance)}</Text>
          </View>

          <View style={styles.grid}>
            <MetricCard
              label="Renda mensal"
              value={`+ ${formatCurrency(summary.data.totalIncome)}`}
              tone="income"
              meta="Abrir detalhes"
              onPress={() => router.push('/(tabs)/incomes')}
            />
            <MetricCard
              label="Gastos totais"
              value={`- ${formatCurrency(summary.data.totalExpense)}`}
              meta="Abrir detalhes"
              onPress={() => router.push('/(tabs)/expenses')}
            />
          </View>
        </>
      ) : null}

      <View style={styles.quickActions}>
        <ActionButton
          label="+ Nova Renda"
          onPress={() => setIncomeOpen(true)}
          style={{ flex: 1 }}
        />
        <ActionButton
          label="+ Novo Gasto"
          variant="secondary"
          onPress={() => setExpenseOpen(true)}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Proximos recorrentes</Text>
          <Text style={styles.sectionLink} onPress={() => router.push('/(tabs)/recurrences')}>
            Ver todos
          </Text>
        </View>
        {(recurrences.data ?? [])
          .slice()
          .sort((a, b) => dayFromIso(a.startDate) - dayFromIso(b.startDate))
          .slice(0, 3)
          .map((recurrence) => (
            <View key={recurrence.id} style={styles.recurrence}>
              <Text style={styles.recurrenceTitle}>
                {recurrence.description || 'Sem descricao'}
              </Text>
              <Text style={styles.recurrenceMeta}>
                Dia {dayFromIso(recurrence.startDate)} · {formatCurrency(recurrence.amount)}
              </Text>
            </View>
          ))}
      </View>

      <IncomeFormSheet
        open={incomeOpen}
        month={period.month}
        year={period.year}
        onClose={() => setIncomeOpen(false)}
      />
      <ExpenseFormSheet
        open={expenseOpen}
        month={period.month}
        year={period.year}
        onClose={() => setExpenseOpen(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 28,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  heroLabel: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  heroValue: {
    color: colors.text,
    fontSize: 52,
    fontWeight: '900',
    textAlign: 'center',
  },
  grid: {
    gap: 14,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.4,
    textTransform: 'uppercase',
  },
  sectionLink: {
    color: colors.textMuted,
  },
  recurrence: {
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  recurrenceTitle: {
    color: colors.text,
    fontWeight: '800',
  },
  recurrenceMeta: {
    color: colors.textMuted,
    marginTop: 6,
  },
});
