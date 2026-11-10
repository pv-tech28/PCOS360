import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import colors from '../../theme/colors';

export default function EthicalDisclaimer({ text }) {
  const defaultNotice =
    text ||
    "PCOS360 provides AI-assisted educational health intelligence based on clinical guidelines. It does not provide medical diagnosis or replace consultation with a qualified healthcare professional.";

  return (
    <View style={styles.container}>
      <ShieldAlert size={16} color={colors.primary} style={styles.icon} />
      <Text style={styles.text}>{defaultNotice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D8FD',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  icon: {
    marginTop: 2,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 11,
    color: '#6B46C1',
    lineHeight: 16,
  },
});

