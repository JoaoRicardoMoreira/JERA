import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
};

export function TextField(props: TextFieldProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.textDisabled}
        style={[styles.input, props.multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderStrong,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.text,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  multiline: {
    minHeight: 88,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
});
