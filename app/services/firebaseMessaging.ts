import messaging from '@react-native-firebase/messaging';
import notifee, {
  AuthorizationStatus as NotifeeAuthorizationStatus,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import api from './api';
import {API_URLS} from '../constants/api-urls';
import {StorageUtil} from '../utils/storage';

class FirebaseMessagingService {
  private fcmToken: string | null = null;
  private currentUserId: string | null = null;

  /**
   * Initialize Firebase messaging
   * Request permission and get initial token
   */
  async initialize(): Promise<void> {
    try {
      // Request permission for notifications (iOS) and POST_NOTIFICATIONS (Android 13+)
      await this.requestPermission();

      // Get initial token
      await this.getToken();

      // Listen for token refresh
      messaging().onTokenRefresh(this.handleTokenRefresh.bind(this));

      console.log('Firebase messaging initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase messaging:', error);
    }
  }

  /**
   * Get FCM token
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      this.fcmToken = token;

      console.log('=== FCM TOKEN GENERATION ===');
      console.log(`📱 Generated Token: ${token}`);
      console.log(`📏 Token Length: ${token?.length || 0} characters`);
      console.log(`✅ Token Valid: ${!!token}`);
      console.log('============================');

      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Request notifications permission:
   * - iOS: Firebase Messaging requestPermission
   * - Android 13+: Notifee requestPermission (POST_NOTIFICATIONS)
   */
  async requestPermission(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        // Android 13+ requires runtime POST_NOTIFICATIONS permission
        if (Platform.Version >= 33) {
          const settings = await notifee.requestPermission();
          const granted =
            settings.authorizationStatus ===
              NotifeeAuthorizationStatus.AUTHORIZED ||
            settings.authorizationStatus ===
              NotifeeAuthorizationStatus.PROVISIONAL;
          if (!granted) {
            console.log('Android notifications permission not granted');
            return;
          }
        }
      } else {
        // iOS permission
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) {
          console.log('iOS notifications permission not granted');
          return;
        }
      }
    } catch (err) {
      console.warn('Permission request failed', err);
    }
  }

  /**
   * Send FCM token to backend
   */
  async sendTokenToBackend(token: string, userId?: string): Promise<void> {
    try {
      const userIdToUse = userId || this.currentUserId;

      if (!userIdToUse) {
        console.log('No user ID available, skipping token send');
        return;
      }

      // Get JWT token for authentication
      const jwtToken = await StorageUtil.getToken();

      console.log('=== FCM TOKEN DEBUG INFO ===');
      console.log(`📱 FCM Token: ${token}`);
      console.log(`👤 User ID: ${userIdToUse}`);
      console.log(`🔑 JWT Token Available: ${!!jwtToken}`);
      console.log(
        `🔑 JWT Token (first 50 chars): ${jwtToken?.substring(0, 50)}...`,
      );
      console.log(`🌐 API Endpoint: ${API_URLS.USER.FCM_TOKEN}`);
      console.log(`📦 Request Body:`, token);
      console.log('============================');

      if (!jwtToken) {
        console.warn(
          '⚠️ No JWT token found! FCM request may fail with 401/403',
        );
      }

      // Send FCM token as simple string (as per API documentation)
      console.log(`📦 Sending FCM token as string format`);
      console.log(
        `🌐 Full API URL will be: ${api.defaults.baseURL}/${API_URLS.USER.FCM_TOKEN}`,
      );

      const response = await api.post(API_URLS.USER.FCM_TOKEN, token, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ FCM token sent successfully!');
      console.log(`📊 Response Status: ${response.status}`);
      console.log(`📋 Response Data:`, response.data);
    } catch (error: any) {
      console.error('❌ Error sending FCM token to backend:');
      console.error(`🔍 Error Type: ${error.constructor.name}`);
      console.error(`📊 Status Code: ${error.response?.status}`);
      console.error(`📋 Response Data:`, error.response?.data);
      console.error(`🌐 Request URL: ${error.config?.url}`);
      console.error(`📦 Request Data:`, error.config?.data);
      console.error(`🔑 Request Headers:`, error.config?.headers);
      console.error('Full Error Object:', error);
    }
  }

  /**
   * Handle token refresh
   */
  private async handleTokenRefresh(token: string): Promise<void> {
    console.log('FCM token refreshed:', token);
    this.fcmToken = token;

    // Only send to backend if user is logged in
    if (this.currentUserId) {
      await this.sendTokenToBackend(token);
    }
  }

  /**
   * Called when user logs in successfully
   */
  async onUserLogin(userId: string): Promise<void> {
    this.currentUserId = userId;
    console.log(`User logged in: ${userId}`);

    // Get current token and send to backend
    const token = this.fcmToken || (await this.getToken());
    if (token) {
      await this.sendTokenToBackend(token, userId);
    }
  }

  /**
   * Called when user logs out
   */
  onUserLogout(): void {
    console.log('User logged out, clearing FCM context');
    this.currentUserId = null;
  }

  /**
   * Setup notification handlers
   */
  setupNotificationHandlers(): void {
    // Handle notifications when app is in foreground
    messaging().onMessage(async remoteMessage => {
      try {
        const title = String(
          remoteMessage.notification?.title ??
            remoteMessage.data?.title ??
            'Thông báo',
        );
        const body = String(
          remoteMessage.notification?.body ??
            remoteMessage.data?.body ??
            'Bạn có thông báo mới',
        );
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        await notifee.displayNotification({
          title,
          body,
          android: {channelId},
        });
      } catch (e) {
        console.log('Error displaying foreground notification', e);
      }
    });

    // Handle notifications when app is in background/quit
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('FCM message received in background:', remoteMessage);
    });

    // Handle notification tap when app is in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background:',
        remoteMessage,
      );
      // Handle navigation here
    });

    // Handle notification tap when app is quit
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          // Handle navigation here
        }
      });
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.fcmToken;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

// Export singleton instance
export const firebaseMessaging = new FirebaseMessagingService();
