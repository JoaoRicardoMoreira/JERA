import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/forms/ActionButton';
import { TextField } from '@/components/forms/TextField';
import { ModalSheet } from '@/components/sheets/ModalSheet';
import {
  useCategories,
  useCreateTransaction,
} from '@/features/transactions/hooks/useFinanceQueries';
import { formatDateIso } from '@/lib/dates/format';
import { toDecimalString } from '@/lib/money/format';

type IncomeFormSheetProps = {
  open: boolean;
  month: number;
  year: number;
  onClose: () => void;
};

export function IncomeFormSheet({ open, month, year, onClose }: IncomeFormSheetProps) {
  const categories = useCategories();
  const createIncome = useCreateTransaction(month, year, 'INCOME');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [occurredAt, setOccurredAt] = useState(formatDateIso());
  const incomeCategory = categories.data?.find((category) => category.type === 'INCOME');

  async function submit() {
    await createIncome.mutateAsync({
      amount: toDecimalString(amount),
      occurredAt,
      description,
      categoryId: incomeCategory?.id ?? null,
    });
    setDescription('');
    setAmount('');
    setOccurredAt(formatDateIso());
    onClose();
  }

  return (
    <ModalSheet open={open} eyebrow="Nova renda" title="Adicionar entrada" onClose={onClose}>
      <View style={styles.form}>
        <TextField
          label="Descricao"
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Salario"
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
        <ActionButton label="Adicionar Renda" loading={createIncome.isPending} onPress={submit} />
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
});
