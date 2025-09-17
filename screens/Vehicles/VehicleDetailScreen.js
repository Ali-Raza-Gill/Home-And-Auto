// import { useEffect, useState } from "react";
// import { View, Text, ScrollView, Alert } from "react-native";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import { supabase } from "../../lib/supabase";

// export default function VehicleDetailScreen({ route, navigation }) {
//   const { id, mode } = route.params || {};
//   const isAdd = mode === "add";
//   const [form, setForm] = useState({ year: "", make: "", model: "", nickname: "", mileage: "" });
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     if (!id) return;
//     const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
//     if (error) Alert.alert("Error", error.message);
//     if (data) setForm({ year: data.year || "", make: data.make || "", model: data.model || "", nickname: data.nickname || "", mileage: String(data.mileage || "") });
//   };
//   useEffect(() => { load(); }, [id]);

//   const save = async () => {
//     setSaving(true);
//     const payload = { ...form, mileage: form.mileage ? Number(form.mileage) : null };
//     let error;
//     if (isAdd) ({ error } = await supabase.from("vehicles").insert(payload));
//     else ({ error } = await supabase.from("vehicles").update(payload).eq("id", id));
//     setSaving(false);
//     if (error) Alert.alert("Save failed", error.message);
//     else { Alert.alert("Saved", "Vehicle saved"); navigation.goBack(); }
//   };

//   return (
//     <ScrollView className="flex-1 p-4">
//       <Text className="text-2xl font-bold mb-4">{isAdd ? "Add Vehicle" : "Edit Vehicle"}</Text>
//       <Input label="Year" value={form.year} onChangeText={(t)=>setForm({...form, year: t})} keyboardType="numeric" />
//       <Input label="Make" value={form.make} onChangeText={(t)=>setForm({...form, make: t})} />
//       <Input label="Model" value={form.model} onChangeText={(t)=>setForm({...form, model: t})} />
//       <Input label="Nickname" value={form.nickname} onChangeText={(t)=>setForm({...form, nickname: t})} />
//       <Input label="Mileage" value={form.mileage} onChangeText={(t)=>setForm({...form, mileage: t})} keyboardType="numeric" />
//       <Button title={isAdd ? "Add Vehicle" : "Save"} onPress={save} loading={saving} />
//     </ScrollView>
//   );
// }


import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";

export default function VehicleDetailScreen({ route, navigation }) {
  const { id, mode } = route.params || {};
  const isAdd = mode === "add";
  const [form, setForm] = useState({ year: "", make: "", model: "", nickname: "", mileage: "" });
  const [saving, setSaving] = useState(false);
console.log("form",form)
  const load = async () => {
    if (!id) return;
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
    console.log(data,'data')
    if (error) Alert.alert("Error", error.message);
    if (data) setForm({ year: String( data.year) || "", make: data.make || "", model: data.model || "", nickname: data.nickname || "", mileage: String(data.mileage || "") });
  };
  useEffect(() => { load(); }, [id]);

const save = async () => {
  setSaving(true);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    Alert.alert("Auth Error", userError.message);
    setSaving(false);
    return;
  }

  const payload = { 
    ...form, 
    mileage: form.mileage ? Number(form.mileage) : null, 
    user_id: user.id 
  };

  let error;
  if (isAdd) ({ error } = await supabase.from("vehicles").insert(payload));
  else ({ error } = await supabase.from("vehicles").update(payload).eq("id", id));

  setSaving(false);
  if (error) Alert.alert("Save failed", error.message);
  else { 
    Alert.alert("Saved", "Vehicle saved successfully"); 
    navigation.goBack(); 
  }
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="car-sport" size={32} color="white" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{isAdd ? "Add Vehicle" : "Edit Vehicle"}</Text>
            <Text style={styles.headerSubtitle}>
              {isAdd ? "Add a new vehicle to track" : "Update your vehicle details"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Form */}
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContent}>
          {/* Vehicle Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car-outline" size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputWrapper, { flex: 0.48 }]}>
                <Input 
                  label="Year" 
                  value={form.year} 
                  onChangeText={(t) => setForm({...form, year: t})} 
                  keyboardType="numeric"
                  placeholder="2020"
                  style={styles.input}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 0.48 }]}>
                <Input 
                  label="Make" 
                  value={form.make} 
                  onChangeText={(t) => setForm({...form, make: t})}
                  placeholder="Toyota"
                  style={styles.input}
                />
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Model" 
                value={form.model} 
                onChangeText={(t) => setForm({...form, model: t})}
                placeholder="Camry"
                style={styles.input}
              />
            </View>
          </View>

          {/* Personal Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={20} color="#FFA726" />
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Nickname" 
                value={form.nickname} 
                onChangeText={(t) => setForm({...form, nickname: t})}
                placeholder="My Car, Daily Driver, etc."
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Current Mileage" 
                value={form.mileage} 
                onChangeText={(t) => setForm({...form, mileage: t})} 
                keyboardType="numeric"
                placeholder="50000"
                style={styles.input}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button 
              title={isAdd ? "Add Vehicle" : "Save Changes"} 
              onPress={save} 
              loading={saving}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
            
          </View>
        </View>
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
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 16,
  },
  inputWrapper: {
    // marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionSection: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 32,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});