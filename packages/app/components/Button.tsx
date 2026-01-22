import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export function Button({ title, isLoading, variant = 'primary', ...rest }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity 
      className={`w-full p-4 rounded-xl items-center justify-center ${
        isPrimary ? "bg-blue-600" : "bg-transparent border border-blue-600"
      } ${rest.disabled ? "opacity-50" : ""}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? "#FFF" : "#2563EB"} />
      ) : (
        <Text className={`font-bold text-lg ${isPrimary ? "text-white" : "text-blue-600"}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}