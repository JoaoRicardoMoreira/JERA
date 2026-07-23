import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { RecurrenceFormSheet } from '@/features/recurrences/RecurrenceFormSheet';
import {
  useDeleteRecurrence,
  useProcessRecurrences,
  useRecurrences,
} from '@/features/recurrences/recurrences.hooks';
import { currentPeriod, dayFromIso } from '@/lib/dates/format';
import { formatCurrency } from '@/lib/money/format';
import { colors } from '@/theme/colors';

const period = currentPeriod();

export default function RecurrencesScreen() {
  const [open, setOpen] = useState(false);
  const recurrences = useRecurrences();
  const remove = useDeleteRecurrence();
  const process = useProcessRecurrences(period.month, period.year);

  return (
    <AppScreen>
      <AppHeader
        eyebrow="Recorrentes"
        title={`${recurrences.data?.length ?? 0} ativos`}
        action={<ActionButton label="+ Novo" variant="investment" onPress={() => setOpen(true)} />}
      />
      <ActionButton
        label="Processar periodo"
        variant="secondary"
        loading={process.isPending}
        onPress={() => process.mutate()}
      />
      {recurrences.isLoading ? <LoadingState label="Carregando recorrentes..." /> : null}
      {recurrences.error ? <ErrorState message="Nao foi possivel carregar recorrentes." /> : null}
      {recurrences.data?.length === 0 ? <EmptyState label="Nenhum recorrente ativo." /> : null}
      {recurrences.data?.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.description || 'Sem descricao'}</Text>
            <Text style={styles.meta}>
              {item.type === 'EXPENSE' ? 'Gasto' : 'Renda'} · Dia {dayFromIso(item.startDate)}
              {item.categoryName ? ` · ${item.categoryName}` : ''}
            </Text>
          </View>
          <View style={styles.side}>
            <Text style={[styles.value, item.type === 'INCOME' && styles.income]}>
              {formatCurrency(item.amount)}
            </Text>
            <Text style={styles.delete} onPress={() => remove.mutate(item.id)}>
              Excluir
            </Text>
          </View>
        </View>
      ))}
      <RecurrenceFormSheet open={open} onClose={() => setOpen(false)} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
    marginTop: 6,
  },
  side: {
    alignItems: 'flex-end',
    gap: 12,
  },
  value: {
    color: colors.text,
    fontWeight: '800',
  },
  income: {
    color: colors.income,
  },
  delete: {
    color: colors.expense,
    fontSize: 12,
  },
});
