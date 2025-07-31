import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import {
  getWeekDays,
  isToday,
  isSameDay,
  getDaysInMonth,
} from '../utils/dateUtils';
import { Event } from '../types';

const { width } = Dimensions.get('window');
const dayWidth = (width - 40) / 7;

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date;
  events: Event[];
  onDayPress: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  selectedDate,
  events,
  onDayPress,
}) => {
  const theme = useTheme();
  const weekDays = getWeekDays();
  const days = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const getEventsForDay = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const renderDay = (date: Date, index: number) => {
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isSelected = isSameDay(date, selectedDate);
    const isTodayDate = isToday(date);
    const dayEvents = getEventsForDay(date);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayContainer,
          {
            backgroundColor: isSelected ? theme.primary : 'transparent',
            borderColor: isTodayDate ? theme.primary : 'transparent',
          },
        ]}
        onPress={() => onDayPress(date)}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isSelected
                ? theme.background
                : isCurrentMonth
                ? theme.text
                : theme.textSecondary,
              fontWeight: isTodayDate ? 'bold' : 'normal',
            },
          ]}
        >
          {date.getDate()}
        </Text>

        {dayEvents.length > 0 && (
          <View style={styles.eventIndicatorContainer}>
            {dayEvents.slice(0, 3).map((event, eventIndex) => (
              <View
                key={eventIndex}
                style={[
                  styles.eventIndicator,
                  { backgroundColor: event.color },
                ]}
              />
            ))}
            {dayEvents.length > 3 && (
              <Text
                style={[styles.moreEventsText, { color: theme.textSecondary }]}
              >
                +{dayEvents.length - 3}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {/* Week day headers */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDayHeader}>
            <Text style={[styles.weekDayText, { color: theme.textSecondary }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {days.map((date, index) => renderDay(date, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  weekDayHeader: {
    width: dayWidth,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  dayContainer: {
    width: dayWidth,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  moreEventsText: {
    fontSize: 10,
    marginLeft: 2,
  },
});
