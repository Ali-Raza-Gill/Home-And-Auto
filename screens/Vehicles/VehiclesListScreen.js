
import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabase";
import { useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";

export default function VehiclesListScreen({ navigation }) {
  const [vehicles, setVehicles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

const load = async () => {
  setRefreshing(true);
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) Alert.alert("Error", error.message);
  else setVehicles(data || []);
  setRefreshing(false);
};
useFocusEffect(
  useCallback(() => {
    load(); 
  }, [])
);

  const VehicleCard = ({ vehicle, onPress }) => (
    <TouchableOpacity style={styles.vehicleCard} onPress={onPress}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.vehicleCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.vehicleCardContent}>
          <View style={styles.vehicleIconContainer}>
            <Ionicons name="car-sport" size={32} color="white" />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>
              {vehicle.nickname || `${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""}`}
            </Text>
            <View style={styles.vehicleDetailsContainer}>
              {vehicle.mileage && (
                <View style={styles.vehicleDetailItem}>
                  <Ionicons name="speedometer-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.vehicleDetailText}>{vehicle.mileage.toLocaleString()} miles</Text>
                </View>
              )}
              {(vehicle.year || vehicle.make) && (
                <View style={styles.vehicleDetailItem}>
                  <Ionicons name="calendar-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.vehicleDetailText}>{vehicle.year} {vehicle.make}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.vehicleActions}>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.8)" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="car-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Vehicles Added Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first vehicle to start tracking maintenance, repairs, and service history.
      </Text>
      <TouchableOpacity 
        style={styles.emptyActionButton}
        onPress={() => navigation.navigate("VehicleDetail", { mode: "add" })}
      >
        <LinearGradient
          colors={['#4ECDC4', '#44A08D']}
          style={styles.emptyButtonGradient}
        >
          <Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Your First Vehicle</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Vehicles</Text>
            <Text style={styles.headerSubtitle}>Track maintenance and service history</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("VehicleDetail", { mode: "add" })}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.vehiclesContainer}>
            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{vehicles.length}</Text>
                <Text style={styles.statLabel}>Vehicles</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {vehicles.filter(v => v.mileage && v.mileage > 100000).length}
                </Text>
                <Text style={styles.statLabel}>High Mileage</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {new Set(vehicles.map(v => v.make)).size}
                </Text>
                <Text style={styles.statLabel}>Brands</Text>
              </View>
            </View>

            {/* Vehicles List */}
            <View style={styles.vehiclesList}>
              <Text style={styles.listTitle}>Your Vehicles</Text>
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPress={() => navigation.navigate("VehicleDetail", { id: vehicle.id })}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  vehiclesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  vehiclesList: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  vehicleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 8,
  },
  vehicleCardGradient: {
    padding: 20,
  },
  vehicleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  vehicleDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vehicleDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleDetailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  vehicleActions: {
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});