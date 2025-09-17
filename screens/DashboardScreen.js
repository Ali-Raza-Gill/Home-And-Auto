
import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({ homes: 0, vehicles: 0, providers: 0, notifications: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const [{ count: homes }, { count: vehicles }, { count: providers }, { count: notifications }] = await Promise.all([
        supabase.from("homes").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("service_providers").select("*", { count: "exact", head: true }),
        supabase.from("notifications").select("*", { count: "exact", head: true }),
      ]);
      setStats({ homes: homes || 0, vehicles: vehicles || 0, providers: providers || 0, notifications: notifications || 0 });
    } catch (e) {
      console.log(e);
    }
    setRefreshing(false);
  };

useFocusEffect(
  useCallback(() => {
    load(); 
  }, [])
);
  const logout = async () => {
    await supabase.auth.signOut();
    navigation.replace("Login");
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ title, icon, onPress, gradient }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <LinearGradient
        colors={gradient}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.actionContent}>
          <Ionicons name={icon} size={28} color="white" />
          <Text style={styles.actionText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Here's a concise snapshot of your homes, vehicles and service ecosystem.
        </Text>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            title="Home Profiles"
            value={stats.homes}
            icon="home-outline"
            color="#FF6B6B"
            onPress={() => navigation.navigate("Homes")}
          />
          <StatCard
            title="Vehicles"
            value={stats.vehicles}
            icon="car-outline"
            color="#4ECDC4"
            onPress={() => navigation.navigate("Vehicles")}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Service Providers"
            value={stats.providers}
            icon="people-outline"
            color="#45B7D1"
            onPress={() => navigation.navigate("Service Providers")}
          />
          <StatCard
            title="Notifications"
            value={stats.notifications}
            icon="notifications-outline"
            color="#FFA726"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <QuickActionButton
            title="Add New Home"
            icon="home"
            gradient={['#FF6B6B', '#FF8E8E']}
            onPress={() => navigation.navigate("Homes")}
          />
          <QuickActionButton
            title="Add Vehicle"
            icon="car-sport"
            gradient={['#4ECDC4', '#44A08D']}
            onPress={() => navigation.navigate("Vehicles")}
          />
          <QuickActionButton
            title="Find Service Provider"
            icon="search"
            gradient={['#45B7D1', '#96C93D']}
            onPress={() => navigation.navigate("Service Providers")}
          />
          <QuickActionButton
            title="Community"
            icon="chatbubbles"
            gradient={['#FFA726', '#FB8C00']}
            onPress={() => navigation.navigate("Community")}
          />
        </View>
      </View>

      {/* Recent Activity Placeholder */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityIconContainer}>
            <Ionicons name="time-outline" size={20} color="#666" />
          </View>
          <Text style={styles.activityText}>No recent activity</Text>
          <Text style={styles.activitySubtext}>Your maintenance logs and updates will appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});