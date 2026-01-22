import { TextInput, View, Text, TextInputProps } from "react-native";
import { useState } from "react";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      {label && <Text className="text-gray-600 font-semibold mb-1 ml-1">{label}</Text>}
      
      <TextInput
        className={`w-full p-4 bg-gray-50 rounded-xl border ${
          error 
            ? "border-red-500" 
            : isFocused 
              ? "border-blue-500 bg-white" 
              : "border-gray-200"
        } text-gray-800`}
        placeholderTextColor="#9CA3AF"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none" // Importante: String correta
        autoCorrect={false}   // Importante: Boolean correto (sem aspas)
        {...rest}
      />
      
      {error && <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
}