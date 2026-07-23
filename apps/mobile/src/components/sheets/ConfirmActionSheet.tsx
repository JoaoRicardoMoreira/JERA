import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/forms/ActionButton';
import { colors } from '@/theme/colors';

import { ModalSheet } from './ModalSheet';

type ConfirmActionSheetProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmActionSheet({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  loading,
  onConfirm,
  onClose,
}: ConfirmActionSheetProps) {
  return (
    <ModalSheet open={open} eyebrow="Confirmacao" title={title} onClose={onClose}>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <ActionButton label="Cancelar" variant="secondary" onPress={onClose} style={{ flex: 1 }} />
        <ActionButton
          label={confirmLabel}
          variant="danger"
          loading={loading}
          onPress={onConfirm}
          style={{ flex: 1 }}
        />
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  message: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
