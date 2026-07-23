import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { spacing } from './spacing';

export const componentStyles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
  },
  field: {
    minHeight: 48,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    paddingHorizontal: spacing.lg,
  },
});
