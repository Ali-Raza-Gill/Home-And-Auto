import { View, TextInput, Text } from "react-native";

export default function Input({ label, placeholder="", secureTextEntry=false, value, onChangeText, keyboardType="default", className="" }) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      {label ? <Text className="mb-1 text-slate-600">{label}</Text> : null}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 bg-white"
      />
    </View>
  );
}
