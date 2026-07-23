import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';

type AppHeaderProps = {
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
};

export function AppHeader({ eyebrow, title, action }: AppHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.textGroup}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 1,
    gap: 8,
  },
  eyebrow: {
    ...typography.label,
    color: colors.textSubtle,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
});
