
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet,TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";

export default function HomeDetailScreen({ route, navigation }) {
  const { id, mode } = route.params || {};
  const isAdd = mode === "add";
  const [form, setForm] = useState({ name: "", city: "", address: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const { data, error } = await supabase.from("homes").select("*").eq("id", id).maybeSingle();
    if (error) Alert.alert("Error", error.message);
    if (data) setForm({ name: data.name || "", city: data.city || "", address: data.address || "", notes: data.notes || "" });
  };

  useEffect(() => { load(); }, [id]);

  // const save = async () => {
  //   setSaving(true);
  //    const { data: { user }, error: userError } = await supabase.auth.getUser();
  //   const payload = { name: form.name, city: form.city, address: form.address, notes: form.notes };
  //   let error;
  //   if (isAdd) ({ error } = await supabase.from("homes").insert(payload));
  //   else ({ error } = await supabase.from("homes").update(payload).eq("id", id));
  //   setSaving(false);
  //   if (error) Alert.alert("Save failed", error.message);
  //   else {
  //     Alert.alert("Saved", "Home saved successfully");
  //     navigation.goBack();
  //   }
  // };


  const save = async () => {
  setSaving(true);
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    Alert.alert("Error", userError.message);
    setSaving(false);
    return;
  }

  const payload = {
    name: form.name,
    city: form.city,
    address: form.address,
    notes: form.notes,
    user_id: user.id, // 👈 important
  };

  let error;
  if (isAdd) {
    ({ error } = await supabase.from("homes").insert(payload));
  } else {
    ({ error } = await supabase.from("homes").update(payload).eq("id", id).eq("user_id", user.id));
  }

  setSaving(false);
  if (error) Alert.alert("Save failed", error.message);
  else {
    Alert.alert("Saved", "Home saved successfully");
    navigation.goBack();
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="home" size={32} color="white" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{isAdd ? "Add Home" : "Edit Home"}</Text>
            <Text style={styles.headerSubtitle}>
              {isAdd ? "Add a new property to track" : "Update your property details"}
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
          {/* Basic Info Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Home Name" 
                value={form.name} 
                onChangeText={(t) => setForm({...form, name: t})}
                placeholder="e.g., My Main House, Vacation Home"
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="City" 
                value={form.city} 
                onChangeText={(t) => setForm({...form, city: t})}
                placeholder="e.g., New York, Los Angeles"
                style={styles.input}
              />
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Location Details</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Full Address" 
                value={form.address} 
                onChangeText={(t) => setForm({...form, address: t})}
                placeholder="123 Main St, City, State ZIP"
                multiline={true}
                numberOfLines={3}
                style={styles.textArea}
              />
            </View>
          </View>

          {/* Notes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#FFA726" />
              <Text style={styles.sectionTitle}>Notes & Details</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Additional Notes" 
                value={form.notes} 
                onChangeText={(t) => setForm({...form, notes: t})}
                placeholder="Any special details about this property..."
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button 
              title={isAdd ? "Add Home" : "Save Changes"} 
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
    // marginBottom: 32,
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
  textArea: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
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
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#FF6B6B',
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
    backgroundColor: '#F0F4FF',
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