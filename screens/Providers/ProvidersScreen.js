
import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function ProvidersScreen({ navigation }) {
  const [providers, setProviders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

const load = async () => {
  setRefreshing(true);
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("service_providers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) Alert.alert("Error", error.message);
  else setProviders(data || []);
  setRefreshing(false);
};

useFocusEffect(
  useCallback(() => {
    load();   // reload providers when screen comes back into focus
  }, [])
);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i}
          name={i <= rating ? "star" : "star-outline"} 
          size={14} 
          color="#FFA726" 
        />
      );
    }
    return stars;
  };

  const getServiceTypeIcon = (serviceType) => {
    const type = serviceType?.toLowerCase() || '';
    if (type.includes('plumb')) return 'water-outline';
    if (type.includes('electric')) return 'flash-outline';
    if (type.includes('hvac') || type.includes('heat') || type.includes('cool')) return 'thermometer-outline';
    if (type.includes('auto') || type.includes('car')) return 'car-outline';
    if (type.includes('lawn') || type.includes('landscape')) return 'leaf-outline';
    return 'construct-outline';
  };

  const getServiceTypeColor = (serviceType) => {
    const type = serviceType?.toLowerCase() || '';
    if (type.includes('plumb')) return '#45B7D1';
    if (type.includes('electric')) return '#FFA726';
    if (type.includes('hvac') || type.includes('heat') || type.includes('cool')) return '#FF6B6B';
    if (type.includes('auto') || type.includes('car')) return '#4ECDC4';
    if (type.includes('lawn') || type.includes('landscape')) return '#96C93D';
    return '#667eea';
  };

  const ProviderCard = ({ provider }) => {
    const iconName = getServiceTypeIcon(provider.service_type);
    const iconColor = getServiceTypeColor(provider.service_type);
    
    return (
      <View style={styles.providerCard}>
        <View style={styles.providerHeader}>
          <View style={[styles.serviceIcon, { backgroundColor: iconColor + '20' }]}>
            <Ionicons name={iconName} size={24} color={iconColor} />
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.companyName}>{provider.company_name}</Text>
            <Text style={styles.serviceType}>{provider.service_type}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(provider.rating || 0)}
            </View>
            <Text style={styles.ratingText}>{provider.rating || 0}</Text>
          </View>
        </View>
        
        <View style={styles.providerDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{provider.service_area}</Text>
          </View>
          
          {provider.website && (
            <View style={styles.detailItem}>
              <Ionicons name="globe-outline" size={16} color="#667eea" />
              <Text style={[styles.detailText, { color: '#667eea' }]}>{provider.website}</Text>
            </View>
          )}
        </View>

        {/* <View style={styles.providerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={18} color="#4ECDC4" />
            <Text style={[styles.actionButtonText, { color: '#4ECDC4' }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={18} color="#FFA726" />
            <Text style={[styles.actionButtonText, { color: '#FFA726' }]}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={18} color="#FF6B6B" />
            <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Save</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="people-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Service Providers Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add trusted service providers to easily find help when you need it.
      </Text>
      <TouchableOpacity 
        style={styles.emptyActionButton}
        onPress={() => navigation.navigate("AddProvider")}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.emptyButtonGradient}
        >
          <Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Service Provider</Text>
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
            <Text style={styles.headerTitle}>Service Providers</Text>
            <Text style={styles.headerSubtitle}>Find trusted professionals for your needs</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("AddProvider")}
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
        {providers.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.providersContainer}>
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
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
    fontSize: 14,
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    // paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  providersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  providerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  providerDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  providerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
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