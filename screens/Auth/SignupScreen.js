import { useState } from "react";
import { View, Text, Alert,TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    if (!email || !password) return Alert.alert("Missing info", "Enter email and password");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) Alert.alert("Sign up failed", error.message);
    else Alert.alert("Check your email", "Verify your account, then log in.");
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
               <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="home" size={32} color="white" />
                <Ionicons name="car-sport" size={24} color="white" style={styles.carIcon} />
              </View>
            </View>
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join thousands of homeowners and car enthusiasts managing their
              assets
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                label="Password"
                placeholder="Min 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Create Account"
                onPress={signUp}
                loading={loading}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
              />

              {/* <Button
                title="Back to Login"
                onPress={() => navigation.navigate("Login")}
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
              /> */}
            </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.signupLink}
              >
                <Text style={styles.signupText}>
                 Already have an account?{" "}
                  <Text style={styles.signupTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  carIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input:{

  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
    signupLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  signupTextBold: {
    fontWeight: 'bold',
    color: 'white',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});