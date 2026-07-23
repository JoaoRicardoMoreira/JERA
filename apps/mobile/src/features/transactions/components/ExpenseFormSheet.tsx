import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/forms/ActionButton';
import { TextField } from '@/components/forms/TextField';
import { ModalSheet } from '@/components/sheets/ModalSheet';
import {
  useCategories,
  useCreateTransaction,
} from '@/features/transactions/hooks/useFinanceQueries';
import { formatDateIso } from '@/lib/dates/format';
import { toDecimalString } from '@/lib/money/format';
import { colors } from '@/theme/colors';

type ExpenseFormSheetProps = {
  open: boolean;
  month: number;
  year: number;
  onClose: () => void;
};

export function ExpenseFormSheet({ open, month, year, onClose }: ExpenseFormSheetProps) {
  const categories = useCategories();
  const createExpense = useCreateTransaction(month, year, 'EXPENSE');
  const expenseCategories = useMemo(
    () => categories.data?.filter((category) => category.type === 'EXPENSE') ?? [],
    [categories.data],
  );
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredAt, setOccurredAt] = useState(formatDateIso());
  const [categoryId, setCategoryId] = useState<string | null>(null);

  async function submit() {
    await createExpense.mutateAsync({
      amount: toDecimalString(amount),
      occurredAt,
      description,
      categoryId,
    });
    setDescription('');
    setAmount('');
    setOccurredAt(formatDateIso());
    setCategoryId(null);
    onClose();
  }

  return (
    <ModalSheet open={open} eyebrow="Novo gasto" title="Adicionar saida" onClose={onClose}>
      <View style={styles.form}>
        <TextField
          label="Descricao"
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Mercado"
        />
        <TextField
          label="Valor"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Data"
          value={occurredAt}
          onChangeText={setOccurredAt}
          placeholder="YYYY-MM-DD"
        />
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {expenseCategories.map((category) => {
            const active = category.id === categoryId;

            return (
              <Pressable
                key={category.id}
                onPress={() => setCategoryId(category.id)}
                style={[styles.category, active && styles.categoryActive]}
              >
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ActionButton
          label="Adicionar Gasto"
          variant="danger"
          loading={createExpense.isPending}
          onPress={submit}
        />
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  category: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryActive: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: colors.income,
  },
  categoryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryLabelActive: {
    color: colors.income,
  },
});
