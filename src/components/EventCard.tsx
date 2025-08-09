import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { Event } from '../types';
import { formatTime } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

interface EventCardProps {
  event: Event;
  onPress?: (event: Event) => void;
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

  const handlePress = () => {
    if (onPress) onPress(event);
  };

  const handleEdit = (e: any) => {
    e?.stopPropagation();
    if (onEdit) onEdit(event);
  };

  const handleDelete = (e: any) => {
    e?.stopPropagation();
    if (onDelete) onDelete(event);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surface,
            borderLeftWidth: 4,
            borderLeftColor: event.color || theme.primary,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.timeContainer}>
            <View
              style={[
                styles.timeDot,
                { backgroundColor: event.color || theme.primary },
              ]}
            />
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>
              {formatTime(startDate)} - {formatTime(endDate)}
            </Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
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

          <View style={styles.footer}>
            <View style={styles.locationContainer}>
              {event.location && (
                <View style={styles.locationRow}>
                  <Icon
                    name="location-outline"
                    size={14}
                    color={theme.textSecondary}
                    style={styles.locationIcon}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      { color: theme.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {event.location}
                  </Text>
                </View>
              )}
            </View>

            {(onEdit || onDelete) && (
              <View style={styles.actions}>
                {onEdit && (
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={styles.actionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon
                      name="create-outline"
                      size={18}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.actionButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="trash-outline" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  content: {
    padding: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});
