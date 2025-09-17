import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, Alert, StyleSheet,TouchableOpacity, TextInput } from "react-native";
import { supabase } from "../../lib/supabase";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newPost, setNewPost] = useState("");

  const load = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false }).limit(50);
    if (error) Alert.alert("Error", error.message);
    else setPosts(data || []);
    setRefreshing(false);
  };
  useEffect(() => { load(); }, []);

  const createPost = async () => {
    if (!newPost.trim()) return;
   const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a post.");
      setIsCreatingPost(false);
      return;
    }

    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      content: newPost,
      author: user.email || "Community Member",
    });
    if (error) Alert.alert("Error", error.message);
    else { setNewPost(""); load(); }
  };
     const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
         <Ionicons name="people-outline" size={64} color="#E0E0E0" />
       </View>
       <Text style={styles.emptyTitle}>Start the Conversation</Text>
       <Text style={styles.emptySubtitle}>
         Be the first to share a tip, ask a question, or show off your latest home or auto project!
       </Text>
     </View>
   );

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={load} />
      }
    >
    <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Community</Text>
            <Text style={styles.headerSubtitle}>Connect, share, and learn together</Text>
          </View>
          <View style={styles.communityStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.communityContainer}>
        <View className="my-6">
          <Input
            label="Create a post"
            value={newPost}
            onChangeText={setNewPost}
          />
          <Button title="Post" onPress={createPost} />
        </View>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.postsContainer}>
            <View style={styles.postsHeader}>
              <Text style={styles.postsTitle}>Community Feed</Text>
            </View>

            <View className="gap-3">
              {posts.map((post) => (
                <View style={styles.postCard} key={post.id}>
                  <View style={styles.postHeader}>
                    <View style={[styles.postIcon, { backgroundColor: "#4ECDC4" }]}>
                      <Ionicons name="person-outline" size={20} />
                    </View>
                    <View style={styles.postMeta}>
                      <Text style={styles.authorName}>
                        {post.author || "Community Member"}
                      </Text>
                      <View style={styles.postTimeContainer}>
                        <Ionicons name="time-outline" size={12} color="#999" />
                        <Text style={styles.postTime}>{new Date(post.created_at).toLocaleDateString()||'unknown date'}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.postContent}>{post.content}</Text>
                </View>
              ))}
              {posts.length === 0 && (
                <Text className="text-slate-500">No posts yet.</Text>
              )}
            </View>
          </View>
        )}
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
  communityStats: {
    alignItems: 'center',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  communityContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  createPostCard: {
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
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  postInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postOptions: {
    flexDirection: 'row',
    flex: 1,
  },
  postOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  postOptionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  postsContainer: {
    marginTop: 8,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  postTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  postMenuButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 16,
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
  },
});