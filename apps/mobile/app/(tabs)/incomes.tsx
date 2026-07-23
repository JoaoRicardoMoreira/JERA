import { useState } from 'react';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { TransactionListItem } from '@/components/lists/TransactionListItem';
import { IncomeFormSheet } from '@/features/transactions/components/IncomeFormSheet';
import {
  useDeleteTransaction,
  useMonthlySummary,
  useTransactions,
} from '@/features/transactions/hooks/useFinanceQueries';
import { currentPeriod, periodLabel } from '@/lib/dates/format';
import { formatCurrency } from '@/lib/money/format';

const period = currentPeriod();

export default function IncomesScreen() {
  const [open, setOpen] = useState(false);
  const summary = useMonthlySummary(period.month, period.year);
  const incomes = useTransactions(period.month, period.year, 'INCOME');
  const remove = useDeleteTransaction(period.month, period.year, 'INCOME');

  return (
    <AppScreen>
      <AppHeader
        eyebrow={`Rendas · ${periodLabel(period.month, period.year)}`}
        title={summary.data ? `+ ${formatCurrency(summary.data.totalIncome)}` : undefined}
        action={<ActionButton label="+ Nova" onPress={() => setOpen(true)} />}
      />
      {incomes.isLoading ? <LoadingState label="Carregando rendas..." /> : null}
      {incomes.error ? <ErrorState message="Nao foi possivel carregar as rendas." /> : null}
      {incomes.data?.length === 0 ? <EmptyState label="Nenhuma renda neste periodo." /> : null}
      {incomes.data?.map((item) => (
        <TransactionListItem key={item.id} item={item} onDelete={() => remove.mutate(item.id)} />
      ))}
      <IncomeFormSheet
        open={open}
        month={period.month}
        year={period.year}
        onClose={() => setOpen(false)}
      />
    </AppScreen>
  );
}
