import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigation.replace("Main");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) navigation.replace("Main");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    if (!email || !password) return Alert.alert("Missing info", "Enter email and password");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Login failed", error.message);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={styles.keyboardView}
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="home" size={32} color="white" />
                <Ionicons name="car-sport" size={24} color="white" style={styles.carIcon} />
              </View>
            </View>
            
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.title}>Home & Auto Assistant</Text>
            <Text style={styles.subtitle}>
              Keep up with every aspect of your home and auto purchases and maintenance items, 
              because keeping up is no laughing matter.
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
                placeholder="••••••••" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry
                style={styles.input}
              />
            </View>
            
            <Button 
              title="Log In" 
              onPress={signIn} 
              loading={loading}
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
            
            <TouchableOpacity 
              onPress={() => navigation.navigate("Signup")} 
              style={styles.signupLink}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
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
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 6,
  },
  formSection: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 16,
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
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
});