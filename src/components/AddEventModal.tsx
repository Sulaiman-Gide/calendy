import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../hooks/useTheme';
import { Event, RecurrenceRule } from '../types';
import { colors } from '../constants/theme';

interface AddEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  selectedDate?: Date;
  eventToEdit?: Event;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isVisible,
  onClose,
  onSave,
  selectedDate,
  eventToEdit,
}) => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(selectedDate || new Date());
  const [endDate, setEndDate] = useState(selectedDate || new Date());
  const [allDay, setAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors.eventColors[0]);
  const [reminderTime, setReminderTime] = useState<number | undefined>(15);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Recurring event fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<
    Date | undefined
  >();
  const [recurrenceCount, setRecurrenceCount] = useState<number | undefined>();
  const [showRecurrenceEndPicker, setShowRecurrenceEndPicker] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || '');
      setLocation(eventToEdit.location || '');
      setStartDate(new Date(eventToEdit.startDate));
      setEndDate(new Date(eventToEdit.endDate));
      setAllDay(eventToEdit.allDay);
      setSelectedColor(eventToEdit.color);
      setReminderTime(eventToEdit.reminderTime);
      setIsRecurring(eventToEdit.isRecurring);
      if (eventToEdit.recurrenceRule) {
        setRecurrenceFrequency(eventToEdit.recurrenceRule.frequency);
        setRecurrenceInterval(eventToEdit.recurrenceRule.interval);
        setRecurrenceEndDate(
          eventToEdit.recurrenceRule.endDate
            ? new Date(eventToEdit.recurrenceRule.endDate)
            : undefined,
        );
        setRecurrenceCount(eventToEdit.recurrenceRule.count);
      }
    } else {
      resetForm();
    }
  }, [eventToEdit, isVisible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartDate(selectedDate || new Date());
    setEndDate(selectedDate || new Date());
    setAllDay(false);
    setSelectedColor(colors.eventColors[0]);
    setReminderTime(15);
    setIsRecurring(false);
    setRecurrenceFrequency('weekly');
    setRecurrenceInterval(1);
    setRecurrenceEndDate(undefined);
    setRecurrenceCount(undefined);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (endDate < startDate) {
      Alert.alert('Error', 'End time cannot be before start time');
      return;
    }

    const recurrenceRule: RecurrenceRule | undefined = isRecurring
      ? {
          frequency: recurrenceFrequency,
          interval: recurrenceInterval,
          endDate: recurrenceEndDate?.toISOString(),
          count: recurrenceCount,
        }
      : undefined;

    const eventData = {
      title: title.trim(),
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      allDay,
      color: selectedColor,
      reminderTime,
      userId: 'current-user-id', // This should come from auth context
      isRecurring,
      recurrenceRule,
    };

    onSave(eventData);
    resetForm();
    onClose();
  };

  const reminderOptions = [
    { label: 'None', value: undefined },
    { label: '5 minutes', value: 5 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1 day', value: 1440 },
  ];

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' as const },
    { label: 'Weekly', value: 'weekly' as const },
    { label: 'Monthly', value: 'monthly' as const },
    { label: 'Yearly', value: 'yearly' as const },
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {eventToEdit ? 'Edit Event' : 'Add Event'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="Event title"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Event description"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Location</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Event location"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          {/* All Day Toggle */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setAllDay(!allDay)}
            >
              <Text style={[styles.label, { color: theme.text }]}>All Day</Text>
              <View
                style={[
                  styles.toggle,
                  { backgroundColor: allDay ? theme.primary : theme.border },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      backgroundColor: theme.background,
                      transform: [{ translateX: allDay ? 20 : 0 }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Date & Time */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Start</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.text }]}>
                {startDate.toLocaleString()}
              </Text>
              <Icon
                name="calendar-outline"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>End</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.text }]}>
                {endDate.toLocaleString()}
              </Text>
              <Icon
                name="calendar-outline"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Recurring Event */}
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.toggleContainer}
              onPress={() => setIsRecurring(!isRecurring)}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Recurring Event
              </Text>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: isRecurring ? theme.primary : theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      backgroundColor: theme.background,
                      transform: [{ translateX: isRecurring ? 20 : 0 }],
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          {isRecurring && (
            <>
              {/* Frequency */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Frequency
                </Text>
                <View style={styles.frequencyContainer}>
                  {frequencyOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.frequencyOption,
                        {
                          backgroundColor:
                            recurrenceFrequency === option.value
                              ? theme.primary
                              : theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setRecurrenceFrequency(option.value)}
                    >
                      <Text
                        style={[
                          styles.frequencyText,
                          {
                            color:
                              recurrenceFrequency === option.value
                                ? theme.background
                                : theme.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Interval */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Every</Text>
                <View style={styles.intervalContainer}>
                  <TextInput
                    style={[
                      styles.intervalInput,
                      {
                        backgroundColor: theme.surface,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={recurrenceInterval.toString()}
                    onChangeText={text =>
                      setRecurrenceInterval(parseInt(text) || 1)
                    }
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={theme.textSecondary}
                  />
                  <Text style={[styles.intervalText, { color: theme.text }]}>
                    {recurrenceFrequency === 'daily'
                      ? 'days'
                      : recurrenceFrequency === 'weekly'
                      ? 'weeks'
                      : recurrenceFrequency === 'monthly'
                      ? 'months'
                      : 'years'}
                  </Text>
                </View>
              </View>

              {/* End Condition */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.text }]}>End</Text>
                <View style={styles.endConditionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.endConditionOption,
                      {
                        backgroundColor:
                          !recurrenceEndDate && !recurrenceCount
                            ? theme.primary
                            : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => {
                      setRecurrenceEndDate(undefined);
                      setRecurrenceCount(undefined);
                    }}
                  >
                    <Text
                      style={[
                        styles.endConditionText,
                        {
                          color:
                            !recurrenceEndDate && !recurrenceCount
                              ? theme.background
                              : theme.text,
                        },
                      ]}
                    >
                      Never
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.endConditionOption,
                      {
                        backgroundColor: recurrenceEndDate
                          ? theme.primary
                          : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => setShowRecurrenceEndPicker(true)}
                  >
                    <Text
                      style={[
                        styles.endConditionText,
                        {
                          color: recurrenceEndDate
                            ? theme.background
                            : theme.text,
                        },
                      ]}
                    >
                      {recurrenceEndDate
                        ? recurrenceEndDate.toLocaleDateString()
                        : 'End Date'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.endConditionOption,
                      {
                        backgroundColor: recurrenceCount
                          ? theme.primary
                          : theme.surface,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() =>
                      setRecurrenceCount(recurrenceCount ? undefined : 10)
                    }
                  >
                    <Text
                      style={[
                        styles.endConditionText,
                        {
                          color: recurrenceCount
                            ? theme.background
                            : theme.text,
                        },
                      ]}
                    >
                      {recurrenceCount ? `${recurrenceCount} times` : 'Count'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Color Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <View style={styles.colorContainer}>
              {colors.eventColors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          {/* Reminder */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Reminder</Text>
            <View style={styles.reminderContainer}>
              {reminderOptions.map(option => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.reminderOption,
                    {
                      backgroundColor:
                        reminderTime === option.value
                          ? theme.primary
                          : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setReminderTime(option.value)}
                >
                  <Text
                    style={[
                      styles.reminderText,
                      {
                        color:
                          reminderTime === option.value
                            ? theme.background
                            : theme.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: theme.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={handleSave}
          >
            <Text style={[styles.saveText, { color: theme.background }]}>
              {eventToEdit ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <DatePicker
        modal
        open={showStartPicker}
        date={startDate}
        mode="datetime"
        onConfirm={date => {
          setStartDate(date);
          setShowStartPicker(false);
        }}
        onCancel={() => setShowStartPicker(false)}
      />

      <DatePicker
        modal
        open={showEndPicker}
        date={endDate}
        mode="datetime"
        onConfirm={date => {
          setEndDate(date);
          setShowEndPicker(false);
        }}
        onCancel={() => setShowEndPicker(false)}
      />

      <DatePicker
        modal
        open={showRecurrenceEndPicker}
        date={recurrenceEndDate || new Date()}
        mode="date"
        onConfirm={date => {
          setRecurrenceEndDate(date);
          setShowRecurrenceEndPicker(false);
        }}
        onCancel={() => setShowRecurrenceEndPicker(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyOption: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  frequencyText: {
    fontSize: 14,
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intervalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: 80,
  },
  intervalText: {
    fontSize: 16,
  },
  endConditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  endConditionOption: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  endConditionText: {
    fontSize: 14,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  reminderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderOption: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  reminderText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
