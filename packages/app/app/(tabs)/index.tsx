// /packages/app/app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.title}>HelpNow</Text>
      <Text style={styles.subtitle}>Aplicativo iniciado com sucesso 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
});
