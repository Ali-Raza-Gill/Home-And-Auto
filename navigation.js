// import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";

// import LoginScreen from "./screens/Auth/LoginScreen";
// import SignupScreen from "./screens/Auth/SignupScreen";
// import DashboardScreen from "./screens/DashboardScreen";
// import HomesListScreen from "./screens/Homes/HomesListScreen";
// import HomeDetailScreen from "./screens/Homes/HomeDetailScreen";
// import VehiclesListScreen from "./screens/Vehicles/VehiclesListScreen";
// import VehicleDetailScreen from "./screens/Vehicles/VehicleDetailScreen";
// import ProvidersScreen from "./screens/Providers/ProvidersScreen";
// import AddProviderScreen from "./screens/Providers/AddProviderScreen";
// import CommunityScreen from "./screens/Community/CommunityScreen";
// import NotificationsScreen from "./screens/Notifications/NotificationsScreen";

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

// function MainDrawer() {
//   return (
//     <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: true }}>
//       <Drawer.Screen name="Dashboard" component={DashboardScreen} />
//       <Drawer.Screen name="Homes" component={HomesListScreen} />
//       <Drawer.Screen name="Vehicles" component={VehiclesListScreen} />
//       <Drawer.Screen name="Service Providers" component={ProvidersScreen} />
//       <Drawer.Screen name="Community" component={CommunityScreen} />
//       <Drawer.Screen name="Notifications" component={NotificationsScreen} />
//     </Drawer.Navigator>
//   );
// }

// export default function RootNavigation() {
//   const navTheme = {
//     ...DefaultTheme,
//     colors: { ...DefaultTheme.colors, background: "#f8fafc" },
//   };
//   return (
//     <NavigationContainer theme={navTheme}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Signup" component={SignupScreen} />
//         <Stack.Screen name="Main" component={MainDrawer} />
//         <Stack.Screen name="HomeDetail" component={HomeDetailScreen} options={{ headerShown: true, title: "Home" }} />
//         <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} options={{ headerShown: true, title: "Vehicle" }} />
//         <Stack.Screen name="AddProvider" component={AddProviderScreen} options={{ headerShown: true, title: "Add Provider" }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }



import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import LoginScreen from "./screens/Auth/LoginScreen";
import SignupScreen from "./screens/Auth/SignupScreen";
import DashboardScreen from "./screens/DashboardScreen";
import HomesListScreen from "./screens/Homes/HomesListScreen";
import HomeDetailScreen from "./screens/Homes/HomeDetailScreen";
import VehiclesListScreen from "./screens/Vehicles/VehiclesListScreen";
import VehicleDetailScreen from "./screens/Vehicles/VehicleDetailScreen";
import ProvidersScreen from "./screens/Providers/ProvidersScreen";
import AddProviderScreen from "./screens/Providers/AddProviderScreen";
import CommunityScreen from "./screens/Community/CommunityScreen";
import NotificationsScreen from "./screens/Notifications/NotificationsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component
function CustomDrawerContent(props) {
  const menuItems = [
    { name: 'Dashboard', icon: 'grid-outline', color: '#667eea' },
    { name: 'Homes', icon: 'home-outline', color: '#FF6B6B' },
    { name: 'Vehicles', icon: 'car-outline', color: '#4ECDC4' },
    { name: 'Service Providers', icon: 'people-outline', color: '#45B7D1' },
    { name: 'Community', icon: 'chatbubbles-outline', color: '#96C93D' },
    { name: 'Notifications', icon: 'notifications-outline', color: '#FFA726' },
  ];

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.drawerHeader}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="home" size={24} color="white" />
            <Ionicons name="car-sport" size={20} color="white" style={styles.carIcon} />
          </View>
        </View>
        <Text style={styles.appTitle}>Home & Auto Assistant</Text>
        <Text style={styles.appSubtitle}>Keep up with everything that matters</Text>
      </LinearGradient>

      {/* Menu Items */}
      <DrawerContentScrollView {...props} style={styles.menuContainer}>
        <View style={styles.menuItems}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                props.state.routeNames[props.state.index] === item.name && styles.activeMenuItem
              ]}
              onPress={() => props.navigation.navigate(item.name)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={props.state.routeNames[props.state.index] === item.name ? item.color : '#666'} 
                />
              </View>
              <Text style={[
                styles.menuText,
                props.state.routeNames[props.state.index] === item.name && { ...styles.activeMenuText, color: item.color }
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Footer */}
      {/* <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="settings-outline" size={20} color="#666" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Ionicons name="help-circle-outline" size={20} color="#666" />
          <Text style={styles.footerButtonText}>Help & Support</Text>
        </TouchableOpacity>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View> */}
    </View>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator 
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#667eea',
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 100 : 80,
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerTintColor: 'white',
        drawerStyle: {
          backgroundColor: 'transparent',
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          headerTitle: 'Dashboard',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
      <Drawer.Screen 
        name="Homes" 
        component={HomesListScreen}
        options={{
          headerTitle: 'My Homes',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
      <Drawer.Screen 
        name="Vehicles" 
        component={VehiclesListScreen}
        options={{
          headerTitle: 'My Vehicles',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
      <Drawer.Screen 
        name="Service Providers" 
        component={ProvidersScreen}
        options={{
          headerTitle: 'Service Providers',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
      <Drawer.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{
          headerTitle: 'Community',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          headerTitle: 'Notifications',
          headerBackground: () => (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function RootNavigation() {
  const navTheme = {
    ...DefaultTheme,
    colors: { 
      ...DefaultTheme.colors, 
      background: "#F8F9FA",
      card: "#FFFFFF",
      text: "#333333",
      border: "#E5E7EB",
      primary: "#667eea",
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#F8F9FA" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main" component={MainDrawer} />
        <Stack.Screen
          name="HomeDetail"
          component={HomeDetailScreen}
          options={{
            headerShown: true,
            title: "Home Details",
            headerStyle: {
              backgroundColor: "#667eea",
            },
            headerTitleStyle: {
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="VehicleDetail"
          component={VehicleDetailScreen}
          options={{
            headerShown: true,
            title: "Vehicle Details",
            headerStyle: {
              backgroundColor: "#667eea",
            },
            headerTitleStyle: {
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="AddProvider"
          component={AddProviderScreen}
          options={{
            headerShown: true,
            title: "Add Service Provider",
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTitleStyle: {
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  drawerHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  carIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItems: {
    paddingHorizontal: 20,
    marginBottom:30
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: '#F0F4FF',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeMenuText: {
    fontWeight: '600',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  footerButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});