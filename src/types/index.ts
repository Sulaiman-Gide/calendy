export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  color: string;
  reminderTime?: number; // minutes before event
  userId: string;
  createdAt: string;
  updatedAt: string;
  // New recurring fields
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule;
  originalEventId?: string; // For recurring event instances
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months
  endDate?: string; // When to stop recurring
  count?: number; // Number of occurrences
  byDay?: number[]; // For weekly: [0,1,2,3,4,5,6] (Sunday=0)
  byMonthDay?: number[]; // For monthly: [1,2,3...31]
}

export interface CalendarSync {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple';
  accessToken: string;
  refreshToken: string;
  calendarId: string;
  isActive: boolean;
  lastSync: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  fcmToken?: string; // For push notifications
}

export interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  events: Event[];
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
}

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: number; // minutes before event
  sound: boolean;
  vibration: boolean;
  fcmEnabled: boolean;
}
