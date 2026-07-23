import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors } from '@/theme/colors';

type Variant = 'primary' | 'secondary' | 'danger' | 'investment' | 'ghost';

type ActionButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
};

export function ActionButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.text : colors.bg} />
      ) : null}
      <Text
        style={[
          styles.label,
          variant === 'secondary' || variant === 'ghost' ? styles.lightLabel : styles.darkLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  danger: {
    backgroundColor: colors.expense,
  },
  investment: {
    backgroundColor: colors.investment,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  darkLabel: {
    color: colors.bg,
  },
  lightLabel: {
    color: colors.text,
  },
});
