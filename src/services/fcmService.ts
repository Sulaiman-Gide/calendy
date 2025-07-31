import messaging from '@react-native-firebase/messaging';
import { Event } from '../types';

export class FCMService {
  constructor() {
    this.requestUserPermission();
    this.setupMessageHandlers();
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      this.getFCMToken();
    }
  }

  async getFCMToken() {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  setupMessageHandlers() {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // You can show a local notification here
    });

    // Handle notification open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open:', remoteMessage);
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });
  }

  async scheduleEventReminder(event: Event) {
    if (!event.reminderTime) return;

    const eventDate = new Date(event.startDate);
    const reminderDate = new Date(
      eventDate.getTime() - event.reminderTime * 60 * 1000,
    );

    // Don't schedule if reminder time has passed
    if (reminderDate <= new Date()) return;

    // This would typically be sent to your backend to schedule the FCM notification
    // For now, we'll use local notifications as fallback
    console.log(
      'Scheduling FCM reminder for event:',
      event.title,
      'at:',
      reminderDate,
    );
  }

  async sendTestNotification() {
    try {
      const token = await this.getFCMToken();
      if (!token) {
        console.log('No FCM token available');
        return;
      }

      // This would typically be sent to your backend
      console.log('Sending test notification to token:', token);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }
}

export const fcmService = new FCMService();
