import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarGrid } from '../components/CalendarGrid';
import { EventCard } from '../components/EventCard';
import { AddEventModal } from '../components/AddEventModal';
import { Event } from '../types';
import { eventService } from '../services/supabase';
import { notificationService } from '../services/notificationService';
import { isSameDay, getStartOfDay, getEndOfDay } from '../utils/dateUtils';

export const CalendarScreen: React.FC = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>();

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      const monthEvents = await eventService.getEvents(
        'current-user-id', // This should come from auth context
        startOfMonth.toISOString(),
        endOfMonth.toISOString(),
      );
      setEvents(monthEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    setEventToEdit(undefined);
    setShowAddModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setShowAddModal(true);
  };

  const handleDeleteEvent = (event: Event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventService.deleteEvent(event.id);
              notificationService.cancelEventReminder(event.id);
              await loadEvents();
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ],
    );
  };

  const handleSaveEvent = async (
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      if (eventToEdit) {
        await eventService.updateEvent(eventToEdit.id, eventData);
        notificationService.cancelEventReminder(eventToEdit.id);
      } else {
        const newEvent = await eventService.createEvent(eventData);
        if (newEvent.reminderTime) {
          notificationService.scheduleEventReminder(newEvent);
        }
      }
      await loadEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, selectedDate);
    });
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <View style={styles.content}>
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          onDayPress={handleDayPress}
        />

        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={[styles.eventsTitle, { color: theme.text }]}>
              Events for {selectedDate.toLocaleDateString()}
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAddEvent}
            >
              <Icon name="add" size={24} color={theme.background} />
            </TouchableOpacity>
          </View>

          {selectedDateEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon
                name="calendar-outline"
                size={48}
                color={theme.textSecondary}
              />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No events for this day
              </Text>
              <TouchableOpacity
                style={[
                  styles.addEventButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleAddEvent}
              >
                <Text
                  style={[styles.addEventText, { color: theme.background }]}
                >
                  Add Event
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={selectedDateEvents}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <EventCard
                  event={item}
                  onPress={() => handleEditEvent(item)}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={loadEvents}
                  colors={[theme.primary]}
                />
              }
            />
          )}
        </View>
      </View>

      <AddEventModal
        isVisible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        eventToEdit={eventToEdit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  eventsSection: {
    flex: 1,
    paddingTop: 16,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addEventButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addEventText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
