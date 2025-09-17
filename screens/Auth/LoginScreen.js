// import { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import { supabase } from "../../lib/supabase";

// export default function LoginScreen({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const session = supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) navigation.replace("Main");
//     });
//     const { data: listener } = supabase.auth.onAuthStateChange((_evt, session) => {
//       if (session) navigation.replace("Main");
//     });
//     return () => listener.subscription.unsubscribe();
//   }, []);

//   const signIn = async () => {
//     if (!email || !password) return Alert.alert("Missing info", "Enter email and password");
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     setLoading(false);
//     if (error) Alert.alert("Login failed", error.message);
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 px-6 justify-center">
//       <View className="mb-10">
//         <Text className="text-3xl font-extrabold">Welcome to Home & Auto Assistant</Text>
//         <Text className="text-slate-500 mt-2">Keep up with every aspect of your home and auto purchases and maintenance items.</Text>
//       </View>
//       <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
//       <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
//       <Button title="Log In" onPress={signIn} loading={loading} className="mt-2" />
//       <TouchableOpacity onPress={() => navigation.navigate("Signup")} className="mt-4 items-center">
//         <Text className="text-haa-primary">Create an account</Text>
//       </TouchableOpacity>
//     </KeyboardAvoidingView>
//   );
// }


// screens/WelcomeScreen.js

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// // import { Ionicons } from '@expo/vector-icons';
// // import { authService } from '../services/authService';

// const LoginScreen = ({ navigation }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [form, setForm] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//   });

//   // const handleAuth = async () => {
//   //   if (!form.email || !form.password) {
//   //     return Alert.alert('Missing Information', 'Please enter email and password');
//   //   }

//   //   if (!isLogin && !form.fullName) {
//   //     return Alert.alert('Missing Information', 'Please enter your full name');
//   //   }

//   //   setLoading(true);

//   //   try {
//   //     let result;
//   //     if (isLogin) {
//   //       result = await authService.signIn(form.email, form.password);
//   //     } else {
//   //       result = await authService.signUp(form.email, form.password, form.fullName);
//   //     }

//   //     setLoading(false);

//   //     if (result.error) {
//   //       Alert.alert(
//   //         isLogin ? 'Login Failed' : 'Sign Up Failed',
//   //         result.error.message
//   //       );
//   //     } else {
//   //       if (!isLogin) {
//   //         Alert.alert(
//   //           'Account Created!',
//   //           'Please check your email to verify your account.',
//   //           [{ text: 'OK', onPress: () => setIsLogin(true) }]
//   //         );
//   //       }
//   //       // Navigation will be handled by the AuthProvider
//   //     }
//   //   } catch (error) {
//   //     setLoading(false);
//   //     Alert.alert('Error', error.message);
//   //   }
//   // };

//   const updateForm = (field, value) => {
//     setForm(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <LinearGradient
//         colors={['#667eea', '#764ba2']}
//         style={styles.gradient}
//       >
//         <KeyboardAvoidingView
//           style={styles.keyboardView}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Header Section */}
//             <View style={styles.header}>
//               <View style={styles.iconContainer}>
//                 <View style={styles.iconWrapper}>
//                   {/* <Ionicons name="home" size={24} color="white" /> */}
//                 </View>
//                 <View style={styles.iconWrapper}>
//                   {/* <Ionicons name="car" size={24} color="white" /> */}
//                 </View>
//               </View>
              
//               <Text style={styles.title}>Home & Auto Assistant</Text>
//               <Text style={styles.subtitle}>
//                 Keep up with every aspect of your home and auto purchases and 
//                 maintenance items, because keeping up is no laughing matter.
//               </Text>
//             </View>

//             {/* Auth Form */}
//             <View style={styles.formContainer}>
//               {/* Tab Switcher */}
//               <View style={styles.tabContainer}>
//                 <TouchableOpacity
//                   style={[styles.tab, isLogin && styles.activeTab]}
//                   onPress={() => setIsLogin(true)}
//                 >
//                   <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
//                     Login
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.tab, !isLogin && styles.activeTab]}
//                   onPress={() => setIsLogin(false)}
//                 >
//                   <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
//                     Sign Up
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Form Fields */}
//               <View style={styles.inputContainer}>
//                 {!isLogin && (
//                   <View style={styles.inputGroup}>
//                     <Text style={styles.label}>Full Name</Text>
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter your full name"
//                       value={form.fullName}
//                       onChangeText={(value) => updateForm('fullName', value)}
//                       autoCapitalize="words"
//                       returnKeyType="next"
//                     />
//                   </View>
//                 )}

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Email</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your email"
//                     value={form.email}
//                     onChangeText={(value) => updateForm('email', value)}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     returnKeyType="next"
//                   />
//                 </View>

//                 <View style={styles.inputGroup}>
//                   <Text style={styles.label}>Password</Text>
//                   <View style={styles.passwordContainer}>
//                     <TextInput
//                       style={styles.passwordInput}
//                       placeholder="Enter your password"
//                       value={form.password}
//                       onChangeText={(value) => updateForm('password', value)}
//                       secureTextEntry={!showPassword}
//                       returnKeyType="done"
//                       // onSubmitEditing={handleAuth}
//                     />
//                     <TouchableOpacity
//                       style={styles.eyeButton}
//                       onPress={() => setShowPassword(!showPassword)}
//                     >
//                       {/* <Ionicons
//                         name={showPassword ? 'eye-off' : 'eye'}
//                         size={20}
//                         color="#666"
//                       /> */}
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 {isLogin && (
//                   <TouchableOpacity style={styles.forgotPassword}>
//                     <Text style={styles.forgotPasswordText}>
//                       Forgot Password?
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 // onPress={handleAuth}
//                 disabled={loading}
//               >
//                 <LinearGradient
//                   colors={['#667eea', '#764ba2']}
//                   style={styles.submitGradient}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="white" />
//                   ) : (
//                     <Text style={styles.submitButtonText}>
//                       {isLogin ? 'Login' : 'Create Account'}
//                     </Text>
//                   )}
//                 </LinearGradient>
//               </TouchableOpacity>

//               {/* Switch Auth Mode */}
//               <View style={styles.switchContainer}>
//                 <Text style={styles.switchText}>
//                   {isLogin ? "Don't have an account? " : "Already have an account? "}
//                 </Text>
//                 <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
//                   <Text style={styles.switchLink}>
//                     {isLogin ? 'Sign Up' : 'Login'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradient: {
//     flex: 1,
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//     paddingTop: 20,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   iconWrapper: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     padding: 15,
//     borderRadius: 50,
//     marginHorizontal: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     textAlign: 'center',
//     lineHeight: 20,
//     paddingHorizontal: 10,
//   },
//   formContainer: {
//     backgroundColor: 'white',
//     borderRadius: 25,
//     padding: 30,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 15,
//     elevation: 10,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 30,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 2,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 6,
//   },
//   activeTab: {
//     backgroundColor: 'white',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#666',
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: '#667eea',
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#e1e5e9',
//     borderRadius: 10,
//     backgroundColor: '#f8f9fa',
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//   },
//   eyeButton: {
//     paddingHorizontal: 15,
//   },
//   forgotPassword: {
//     alignItems: 'flex-end',
//   },
//   forgotPasswordText: {
//     color: '#667eea',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   submitButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 20,
//   },
//   submitGradient: {
//     paddingVertical: 15,
//     alignItems: 'center',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   switchText: {
//     color: '#666',
//     fontSize: 14,
//   },
//   switchLink: {
//     color: '#667eea',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;


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