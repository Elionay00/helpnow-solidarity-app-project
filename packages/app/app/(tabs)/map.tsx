import { View } from "react-native";
// O Expo vai decidir sozinho:
// No celular ele pega o MapScreen.native.tsx
// No site ele pega o MapScreen.web.tsx
import { MapScreen } from "../../components/MapScreen";

export default function MapRoute() {
  return (
    <View style={{ flex: 1 }}>
      {/* <MapScreen /> <--- Comente esta linha */}
    </View>
  );
}