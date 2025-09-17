// import { useEffect, useState } from "react";
// import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
// import { supabase } from "../../lib/supabase";
// import Card from "../../components/Card";
// import Button from "../../components/Button";

// export default function HomesListScreen({ navigation }) {
//   const [homes, setHomes] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const load = async () => {
//     setRefreshing(true);
//     const { data, error } = await supabase.from("homes").select("*").order("created_at", { ascending: false }).limit(50);
//     if (error) Alert.alert("Error", error.message);
//     else setHomes(data || []);
//     setRefreshing(false);
//   };
//   useEffect(() => { load(); }, []);

//   return (
//     <ScrollView className="flex-1 p-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}>
//       <View className="mb-4 flex-row justify-between items-center">
//         <Text className="text-2xl font-bold">My Homes</Text>
//         <Button title="Add Home" onPress={() => navigation.navigate("HomeDetail", { mode: "add" })} className="w-36 py-2" />
//       </View>
//       <View className="gap-3">
//         {homes.map((h) => (
//           <TouchableOpacity key={h.id} onPress={() => navigation.navigate("HomeDetail", { id: h.id })}>
//             <Card>
//               <Text className="text-lg font-semibold">{h.name || "Unnamed Home"}</Text>
//               <Text className="text-slate-500">{h.city || ""}</Text>
//             </Card>
//           </TouchableOpacity>
//         ))}
//         {homes.length === 0 && <Text className="text-slate-500">No homes yet. Tap "Add Home" to create one.</Text>}
//       </View>
//     </ScrollView>
//   );
// }


import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomesListScreen({ navigation }) {
  const [homes, setHomes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("homes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) Alert.alert("Error", error.message);
    else setHomes(data || []);
    setRefreshing(false);
  };

useFocusEffect(
  useCallback(() => {
    load(); 
  }, [])
);
  const HomeCard = ({ home, onPress }) => (
    <TouchableOpacity style={styles.homeCard} onPress={onPress}>
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.homeCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.homeCardContent}>
          <View style={styles.homeIconContainer}>
            <Ionicons name="home" size={32} color="white" />
          </View>
          <View style={styles.homeInfo}>
            <Text style={styles.homeName}>{home.name || "Unnamed Home"}</Text>
            <View style={styles.homeLocationContainer}>
              <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.homeLocation}>{home.city || "No location set"}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.8)" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="home-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Homes Added Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start by adding your first home to track maintenance, improvements, and purchases.
      </Text>
      <TouchableOpacity 
        style={styles.emptyActionButton}
        onPress={() => navigation.navigate("HomeDetail", { mode: "add" })}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.emptyButtonGradient}
        >
          <Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Your First Home</Text>
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
            <Text style={styles.headerTitle}>My Homes</Text>
            <Text style={styles.headerSubtitle}>Manage your properties and track improvements</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate("HomeDetail", { mode: "add" })}
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
        {homes.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.homesContainer}>
            {homes.map((home) => (
              <HomeCard
                key={home.id}
                home={home}
                onPress={() => navigation.navigate("HomeDetail", { id: home.id })}
              />
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
  homesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  homeCard: {
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
  homeCardGradient: {
    padding: 20,
  },
  homeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  homeInfo: {
    flex: 1,
  },
  homeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  homeLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
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
  }})