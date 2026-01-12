import AsyncStorage from '@react-native-async-storage/async-storage';
// ... dentro do AuthProvider ...

  // 1. Carregar dados ao iniciar
  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem('@Auth:user');
      if (storageUser) {
        setUser(JSON.parse(storageUser));
      }
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, password: string) {
    const response = { name: 'Usuário Logado' }; // Simulação
    setUser(response);
    // 2. Salvar no celular
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(response));
  }

  async function signOut() {
    // 3. Limpar do celular
    await AsyncStorage.clear();
    setUser(null);
  }