/**
 * Punto ÚNICO de acceso a `expo-notifications` en toda la app (patrón Facade).
 *
 * ¿Por qué no `import * as Notifications from 'expo-notifications'`?
 * El índice de la librería también carga la suscripción a temas PUSH, que necesita el módulo
 * nativo `ExpoTopicSubscriptionModule`. Expo Go en Android no lo trae (desde SDK 53 no tiene
 * notificaciones push), así que la importación completa rompe la app con
 * "Cannot find native module 'ExpoTopicSubscriptionModule'".
 *
 * La app solo usa notificaciones LOCALES, así que acá se importan únicamente esas partes.
 * Funciona igual en Expo Go y en la development build. Si en el futuro la librería se corrige,
 * alcanza con cambiar este archivo.
 */
export { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
export {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
export { IosAuthorizationStatus } from 'expo-notifications/build/NotificationPermissions.types';
export { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
export { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
export { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
export { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
