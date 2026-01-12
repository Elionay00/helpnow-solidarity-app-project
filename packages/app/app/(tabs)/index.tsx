const { user, signOut } = useAuth();

// No retorno do JSX:
<ThemedView style={styles.headerRow}>
  <ThemedText type="subtitle">Olá, {user?.name}!</ThemedText>
  <TouchableOpacity onPress={signOut}>
    <ThemedText style={{ color: 'red' }}>Sair</ThemedText>
  </TouchableOpacity>
</ThemedView>