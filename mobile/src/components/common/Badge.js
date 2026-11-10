import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function Badge({ label, variant = 'primary', size = 'medium', style, textStyle }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.secondary,
          text: colors.primary,
        };
      case 'success':
        return {
          bg: colors.successLight,
          text: colors.success,
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          text: colors.warning,
        };
      case 'danger':
        return {
          bg: colors.dangerLight,
          text: colors.danger,
        };
      case 'borderline':
        return {
          bg: '#FFF8E1',
          text: '#B78103',
        };
      case 'accent':
        return {
          bg: colors.accentLight,
          text: '#9C3A6E',
        };
      default:
        return {
          bg: colors.secondary,
          text: colors.primary,
        };
    }
  };

  const currentVariant = getVariantStyles();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: currentVariant.bg,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: currentVariant.text,
            fontSize: isSmall ? 11 : 12,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});

