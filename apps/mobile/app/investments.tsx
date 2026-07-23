import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/States';
import { ActionButton } from '@/components/forms/ActionButton';
import { TextField } from '@/components/forms/TextField';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppScreen } from '@/components/layout/AppScreen';
import { MetricCard } from '@/components/metrics/MetricCard';
import {
  useDeleteInvestmentContribution,
  useInvestments,
  useUpdateInvestmentConfig,
  useUpsertInvestmentContribution,
} from '@/features/investments/investments.hooks';
import { currentPeriod, periodLabel } from '@/lib/dates/format';
import { formatCurrency } from '@/lib/money/format';
import { colors } from '@/theme/colors';

const period = currentPeriod();

export default function InvestmentsScreen() {
  const overview = useInvestments(period.month, period.year);
  const updateConfig = useUpdateInvestmentConfig(period.month, period.year);
  const upsertContribution = useUpsertInvestmentContribution(period.month, period.year);
  const deleteContribution = useDeleteInvestmentContribution(period.month, period.year);
  const [taxa, setTaxa] = useState('');
  const [aporte, setAporte] = useState('');

  const taxaValue = taxa || String(Number(overview.data?.config.taxaMensalPercent ?? 0));

  return (
    <AppScreen>
      <AppHeader
        eyebrow={`Investimentos · ${periodLabel(period.month, period.year)}`}
        title="Planejamento"
      />
      {overview.isLoading ? <LoadingState label="Carregando investimentos..." /> : null}
      {overview.error ? <ErrorState message="Nao foi possivel carregar investimentos." /> : null}
      {overview.data ? (
        <>
          <View style={styles.grid}>
            <MetricCard
              label="Total aportado"
              value={formatCurrency(overview.data.totalAportado)}
              tone="investment"
            />
            <MetricCard
              label="Patrimonio estimado"
              value={formatCurrency(overview.data.patrimonioFinal)}
              tone="income"
            />
            <MetricCard
              label={`Aporte em ${String(period.month).padStart(2, '0')}/${period.year}`}
              value={
                overview.data.currentContribution
                  ? formatCurrency(overview.data.currentContribution.amount)
                  : '-'
              }
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Taxa de rendimento</Text>
            <TextField
              label="Taxa mensal (%)"
              value={taxaValue}
              onChangeText={setTaxa}
              keyboardType="decimal-pad"
            />
            <Text style={styles.meta}>
              Equivalente ao ano: {overview.data.annualEquivalentPercent.toFixed(2)}% a.a.
            </Text>
            <ActionButton
              label="Salvar taxa"
              variant="investment"
              loading={updateConfig.isPending}
              onPress={() => updateConfig.mutate(taxaValue)}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Aporte manual</Text>
            <TextField
              label="Valor"
              value={aporte}
              onChangeText={setAporte}
              keyboardType="decimal-pad"
            />
            <ActionButton
              label="Salvar aporte"
              variant="investment"
              loading={upsertContribution.isPending}
              onPress={() => {
                upsertContribution.mutate(aporte);
                setAporte('');
              }}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Evolucao patrimonial</Text>
            {overview.data.timeline.length === 0 ? (
              <EmptyState label="Cadastre um aporte para ver a evolucao." />
            ) : null}
            {overview.data.timeline.map((point) => (
              <View key={point.key} style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>{point.label}</Text>
                <Text style={styles.timelineValue}>{formatCurrency(point.patrimonio)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Historico de aportes</Text>
            {overview.data.contributions.length === 0 ? (
              <EmptyState label="Nenhum aporte registrado." />
            ) : null}
            {overview.data.contributions.map((item) => (
              <View key={item.id} style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>
                  {String(item.month).padStart(2, '0')}/{item.year}
                </Text>
                <View style={styles.side}>
                  <Text style={styles.investmentValue}>{formatCurrency(item.amount)}</Text>
                  <Text style={styles.delete} onPress={() => deleteContribution.mutate(item.id)}>
                    Excluir
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  card: {
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 16,
    padding: 18,
  },
  sectionTitle: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3.4,
    textTransform: 'uppercase',
  },
  meta: {
    color: colors.textMuted,
  },
  timelineItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  timelineLabel: {
    color: colors.textMuted,
  },
  timelineValue: {
    color: colors.income,
    fontWeight: '800',
  },
  investmentValue: {
    color: colors.investment,
    fontWeight: '800',
  },
  side: {
    alignItems: 'flex-end',
    gap: 6,
  },
  delete: {
    color: colors.expense,
    fontSize: 12,
  },
});
