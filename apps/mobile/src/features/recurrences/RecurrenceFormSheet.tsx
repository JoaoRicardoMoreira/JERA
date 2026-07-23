import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/forms/ActionButton';
import { SegmentedControl } from '@/components/forms/SegmentedControl';
import { TextField } from '@/components/forms/TextField';
import { ModalSheet } from '@/components/sheets/ModalSheet';
import { useCategories } from '@/features/transactions/hooks/useFinanceQueries';
import { formatDateIso } from '@/lib/dates/format';
import { toDecimalString } from '@/lib/money/format';
import { colors } from '@/theme/colors';
import { TransactionType } from '@/types/bff.models';

import { useCreateRecurrence } from './recurrences.hooks';

type RecurrenceFormSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function RecurrenceFormSheet({ open, onClose }: RecurrenceFormSheetProps) {
  const categories = useCategories();
  const createRecurrence = useCreateRecurrence();
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('1');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const filteredCategories = useMemo(
    () => categories.data?.filter((category) => category.type === type) ?? [],
    [categories.data, type],
  );

  async function submit() {
    const startDate = new Date();
    startDate.setDate(Math.max(1, Math.min(31, Number(day) || 1)));

    await createRecurrence.mutateAsync({
      amount: toDecimalString(amount),
      type,
      frequency: 'MONTHLY',
      categoryId,
      description,
      startDate: formatDateIso(startDate),
    });
    setDescription('');
    setAmount('');
    setDay('1');
    setCategoryId(null);
    onClose();
  }

  return (
    <ModalSheet open={open} eyebrow="Recorrentes" title="Nova recorrencia" onClose={onClose}>
      <View style={styles.form}>
        <SegmentedControl
          value={type}
          options={[
            { label: 'Gasto', value: 'EXPENSE' },
            { label: 'Renda', value: 'INCOME' },
          ]}
          onChange={(value) => {
            setType(value);
            setCategoryId(null);
          }}
        />
        <TextField label="Descricao" value={description} onChangeText={setDescription} />
        <TextField
          label="Valor"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <TextField label="Dia" value={day} onChangeText={setDay} keyboardType="number-pad" />
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.categoryGrid}>
          {filteredCategories.map((category) => {
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
          label="Salvar Recorrencia"
          variant="investment"
          loading={createRecurrence.isPending}
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
