import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { Event } from '../types';
import { formatTime, formatDate } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderLeftColor: event.color,
          borderColor: theme.border,
        },
      ]}
      onPress={() => onPress(event)}
    >
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Icon name="time-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.timeText, { color: theme.textSecondary }]}>
            {formatTime(startDate)} - {formatTime(endDate)}
          </Text>
        </View>

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(event)}
            >
              <Icon name="create-outline" size={16} color={theme.primary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(event)}
            >
              <Icon name="trash-outline" size={16} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {event.title}
      </Text>

      {event.description && (
        <Text
          style={[styles.description, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {event.description}
        </Text>
      )}

      {event.location && (
        <View style={styles.locationContainer}>
          <Icon name="location-outline" size={14} color={theme.textSecondary} />
          <Text
            style={[styles.locationText, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {formatDate(startDate, 'dd/mm/yy')}
        </Text>

        {event.reminderTime && (
          <View style={styles.reminderContainer}>
            <Icon
              name="notifications-outline"
              size={14}
              color={theme.warning}
            />
            <Text style={[styles.reminderText, { color: theme.warning }]}>
              {event.reminderTime} min before
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
