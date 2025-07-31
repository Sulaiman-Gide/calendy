import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { getMonthName } from '../utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

const { width } = Dimensions.get('window');

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.primary,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: theme.background }]}
        onPress={onPreviousMonth}
        activeOpacity={0.8}
      >
        <Icon name="chevron-back" size={28} color={theme.primary} />
      </TouchableOpacity>

      <View style={styles.monthTextContainer}>
        <Text
          style={[styles.monthText, { color: theme.text }]}
          numberOfLines={1}
        >
          {getMonthName(currentDate)}
        </Text>
        <Text
          style={[styles.yearText, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {currentDate.getFullYear()}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.navButton, { backgroundColor: theme.background }]}
        onPress={onNextMonth}
        activeOpacity={0.8}
      >
        <Icon name="chevron-forward" size={28} color={theme.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.todayButton,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
        onPress={onToday}
        activeOpacity={0.9}
      >
        <Icon name="calendar-outline" size={18} color={theme.background} />
        <Text style={[styles.todayText, { color: theme.background }]}>
          Today
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 32 : 16,
    paddingBottom: 16,
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 24,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    minHeight: 72,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  monthTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginHorizontal: 8,
  },
  monthText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 2,
    letterSpacing: 0.2,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginLeft: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  todayText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
});
