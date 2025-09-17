import { View, Text } from "react-native";

export default function Card({ title, value, onPress, children, className="" }) {
  return (
    <View className={`rounded-2xl bg-white/90 border border-slate-200 p-4 ${className}`}>
      {title ? <Text className="text-slate-500 text-xs">{title}</Text> : null}
      {value ? <Text className="text-2xl font-bold">{value}</Text> : null}
      {children}
    </View>
  );
}
