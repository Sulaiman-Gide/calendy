import PushNotification from 'react-native-push-notification';
import { Event } from '../types';

export class NotificationService {
  constructor() {
    this.configurePushNotifications();
  }

  configurePushNotifications() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'kalendi-events',
        channelName: 'Kalendi Events',
        channelDescription: 'Event reminders and notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`),
    );
  }

  scheduleEventReminder(event: Event) {
    if (!event.reminderTime) return;

    const eventDate = new Date(event.startDate);
    const reminderDate = new Date(
      eventDate.getTime() - event.reminderTime * 60 * 1000,
    );

    // Don't schedule if reminder time has passed
    if (reminderDate <= new Date()) return;

    PushNotification.localNotificationSchedule({
      channelId: 'kalendi-events',
      title: 'Event Reminder',
      message: `${event.title} starts in ${event.reminderTime} minutes`,
      date: reminderDate,
      allowWhileIdle: true,
      repeatType: 'day',
      id: `event-${event.id}`,
      userInfo: {
        eventId: event.id,
        type: 'event_reminder',
      },
    });
  }

  cancelEventReminder(eventId: string) {
    PushNotification.cancelLocalNotifications({
      id: `event-${eventId}`,
    });
  }

  showImmediateNotification(title: string, message: string) {
    PushNotification.localNotification({
      channelId: 'kalendi-events',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
    });
  }
}

export const notificationService = new NotificationService();
