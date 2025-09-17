
import { useState } from "react";
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from "../../components/Input";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";

export default function AddProviderScreen({ navigation }) {
  const [form, setForm] = useState({ 
    company_name: "", 
    service_type: "", 
    service_area: "", 
    website: "", 
    reviews: "", 
    rating: 5 
  });
  const [saving, setSaving] = useState(false);

const save = async () => {
  if (!form.company_name || !form.service_type || !form.service_area) {
    Alert.alert("Missing Information", "Please fill in company name, service type, and service area.");
    return;
  }

  setSaving(true);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    Alert.alert("Auth Error", userError.message);
    setSaving(false);
    return;
  }

  const payload = { 
    ...form, 
    rating: Number(form.rating) || 0,
    user_id: user.id
  };

  const { error } = await supabase.from("service_providers").insert(payload);
  setSaving(false);

  if (error) Alert.alert("Error", error.message);
  else {
    Alert.alert("Success", "Provider added successfully"); 
    navigation.goBack(); 
  }
};


  const RatingSelector = () => (
    <View style={styles.ratingContainer}>
      {/* <Text style={styles.ratingLabel}>Rating</Text> */}
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setForm({...form, rating: star})}
            style={styles.starButton}
          >
            <Ionicons 
              name={star <= form.rating ? "star" : "star-outline"} 
              size={32} 
              color="#FFA726" 
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>{form.rating} out of 5 stars</Text>
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
          <View style={styles.headerIconContainer}>
            <Ionicons name="people" size={32} color="white" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Add Service Provider</Text>
            <Text style={styles.headerSubtitle}>
              Add a trusted professional to your network
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
          {/* Company Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={20} color="#667eea" />
              <Text style={styles.sectionTitle}>Company Information</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Company Name *" 
                value={form.company_name} 
                onChangeText={(t) => setForm({...form, company_name: t})}
                placeholder="ABC Plumbing Services"
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Service Type *" 
                value={form.service_type} 
                onChangeText={(t) => setForm({...form, service_type: t})}
                placeholder="Plumbing, HVAC, Auto Repair, etc."
                style={styles.input}
              />
            </View>
          </View>

          {/* Location & Contact */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Location & Contact</Text>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Service Area *" 
                value={form.service_area} 
                onChangeText={(t) => setForm({...form, service_area: t})}
                placeholder="City, ZIP code, or region"
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Website" 
                value={form.website} 
                onChangeText={(t) => setForm({...form, website: t})}
                placeholder="https://www.company.com"
                style={styles.input}
                keyboardType="url"
              />
            </View>
          </View>

          {/* Reviews & Rating */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star-outline" size={20} color="#FFA726" />
              <Text style={styles.sectionTitle}>Reviews & Rating</Text>
            </View>
            
            <RatingSelector />
            
            <View style={styles.inputWrapper}>
              <Input 
                label="Customer Reviews" 
                value={form.reviews} 
                onChangeText={(t) => setForm({...form, reviews: t})}
                placeholder="Share your experience or customer feedback..."
                multiline={true}
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.actionSection}>
            <Button 
              title="Add Service Provider" 
              onPress={save} 
              loading={saving}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
            
            <Text style={styles.helpText}>
              * Note. Adding accurate information helps you and others find the right services.
            </Text>
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
    marginBottom:6
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
    minHeight: 100,
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
  ratingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    marginBottom:40,
    marginTop:10
  },
});
