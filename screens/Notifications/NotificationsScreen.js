
import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../lib/supabase";
import dayjs from "dayjs";

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    const { data, error } = await supabase.from("notifications").select("*").order("due_date", { ascending: true }).limit(100);
    if (error) Alert.alert("Error", error.message);
    else setItems(data || []);
    setRefreshing(false);
  };
  useEffect(() => { load(); }, []);

  const markDone = async (id) => {
    const { error } = await supabase.from("notifications").update({ done: true }).eq("id", id);
    if (!error) load();
  };

  const getNotificationIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('oil') || titleLower.includes('maintenance')) return 'car-outline';
    if (titleLower.includes('home') || titleLower.includes('house')) return 'home-outline';
    if (titleLower.includes('service') || titleLower.includes('repair')) return 'construct-outline';
    return 'notifications-outline';
  };

  const getNotificationColor = (dueDate) => {
    if (!dueDate) return '#FFA726';
    const today = dayjs();
    const due = dayjs(dueDate);
    const daysUntilDue = due.diff(today, 'day');
    
    if (daysUntilDue < 0) return '#FF6B6B'; // Overdue - red
    if (daysUntilDue <= 3) return '#FFA726'; // Due soon - orange
    return '#4ECDC4'; // Future - teal
  };

  const getNotificationStatus = (dueDate) => {
    if (!dueDate) return 'No due date';
    const today = dayjs();
    const due = dayjs(dueDate);
    const daysUntilDue = due.diff(today, 'day');
    
    if (daysUntilDue < 0) return 'Overdue';
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue <= 7) return `Due in ${daysUntilDue} days`;
    return due.format("MMM D, YYYY");
  };

  const NotificationCard = ({ notification }) => {
    const iconName = getNotificationIcon(notification.title);
    const statusColor = getNotificationColor(notification.due_date);
    const statusText = getNotificationStatus(notification.due_date);
    
    return (
      <View style={[styles.notificationCard, notification.done && styles.completedCard]}>
        <View style={styles.notificationHeader}>
          <View style={[styles.notificationIcon, { backgroundColor: statusColor + '20' }]}>
            <Ionicons name={iconName} size={24} color={statusColor} />
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, notification.done && styles.completedText]}>
              {notification.title || "Reminder"}
            </Text>
            <View style={styles.statusContainer}>
              <Ionicons name="time-outline" size={14} color={statusColor} />
              <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
            </View>
          </View>
          {!notification.done && (
            <TouchableOpacity 
              onPress={() => markDone(notification.id)} 
              style={[styles.actionButton, { borderColor: statusColor }]}
            >
              <Ionicons name="checkmark" size={18} color={statusColor} />
            </TouchableOpacity>
          )}
        </View>
        
        {notification.done && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.completedBadgeText}>Completed</Text>
          </View>
        )}
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={64} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>All Caught Up!</Text>
      <Text style={styles.emptySubtitle}>
        You have no active notifications. New maintenance reminders and alerts will appear here.
      </Text>
    </View>
  );

  // Separate notifications by status
  const overdueItems = items.filter(item => !item.done && dayjs(item.due_date).isBefore(dayjs(), 'day'));
  const todayItems = items.filter(item => !item.done && dayjs(item.due_date).isSame(dayjs(), 'day'));
  const upcomingItems = items.filter(item => !item.done && dayjs(item.due_date).isAfter(dayjs(), 'day'));
  const completedItems = items.filter(item => item.done);

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Stay on top of your maintenance schedule</Text>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryNumber}>{items.filter(i => !i.done).length}</Text>
              <Text style={styles.summaryText}>Active</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.notificationsContainer}>
            {/* Overdue Section */}
            {overdueItems.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
                  <Text style={[styles.sectionTitle, { color: '#FF6B6B' }]}>Overdue</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{overdueItems.length}</Text>
                  </View>
                </View>
                {overdueItems.map(item => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </View>
            )}

            {/* Today Section */}
            {todayItems.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="today-outline" size={20} color="#FFA726" />
                  <Text style={[styles.sectionTitle, { color: '#FFA726' }]}>Due Today</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{todayItems.length}</Text>
                  </View>
                </View>
                {todayItems.map(item => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </View>
            )}

            {/* Upcoming Section */}
            {upcomingItems.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar-outline" size={20} color="#4ECDC4" />
                  <Text style={[styles.sectionTitle, { color: '#4ECDC4' }]}>Upcoming</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{upcomingItems.length}</Text>
                  </View>
                </View>
                {upcomingItems.map(item => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </View>
            )}

            {/* Completed Section */}
            {completedItems.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                  <Text style={[styles.sectionTitle, { color: '#4CAF50' }]}>Completed</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{completedItems.length}</Text>
                  </View>
                </View>
                {completedItems.slice(0, 5).map(item => (
                  <NotificationCard key={item.id} notification={item} />
                ))}
              </View>
            )}
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
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryContainer: {
    alignItems: 'center',
  },
  summaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  notificationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.7,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  completedBadgeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
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
  },
});