import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={styles.buttonWrapper}
    >
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          (disabled || loading) && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden", 
  },
  gradient: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 16,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
