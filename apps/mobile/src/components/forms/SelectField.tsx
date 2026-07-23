import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  value: string | null;
  options: Option[];
  onChange: (value: string) => void;
};

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, active && styles.active]}
            >
              <Text style={[styles.optionLabel, active && styles.activeLabel]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 10,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  active: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderColor: colors.income,
  },
  optionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.income,
  },
});
