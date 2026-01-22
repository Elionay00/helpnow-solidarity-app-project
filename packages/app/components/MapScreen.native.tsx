import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';

const INITIAL_REGION = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation={true}
        region={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
      >
        <Marker
          coordinate={{ latitude: -23.5505, longitude: -46.6333 }}
          title="Pedido de Ajuda"
          description="Preciso de Cesta Básica"
          pinColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: Dimensions.get('window').width, height: '100%' },
});