import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: "primary" | "outline";
}

export function Button({ title, onPress, isLoading = false, variant = "primary" }: ButtonProps) {
  // Estilos condicionais
  const isPrimary = variant === "primary";
  
  const containerClasses = `p-4 rounded-xl items-center justify-center w-full my-2 ${
    isPrimary ? "bg-blue-600" : "bg-transparent border border-blue-600"
  } ${isLoading ? "opacity-70" : ""}`;

  const textClasses = `${
    isPrimary ? "text-white" : "text-blue-600"
  } font-bold text-lg`;

  return (
    <TouchableOpacity 
      className={containerClasses} 
      onPress={onPress} 
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? "#FFF" : "#2563EB"} />
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}