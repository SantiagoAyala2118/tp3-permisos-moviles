import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import * as Notifications from './moduloNotificaciones';

export const ID_CANAL_REPORTES = 'reportes';

/**
 * Android 8+: crea el canal "reportes". En Android 13+ el diálogo de notificaciones
 * no aparece hasta que exista al menos un canal, por eso se llama ANTES de pedir.
 *
 * Devuelve `true` si el canal quedó disponible. En iOS no hace falta (devuelve `false`).
 * En Expo Go (Android) la creación falla dentro del módulo nativo
 * ("NotificationsChannelsProvider" nulo), así que ni se intenta: Expo Go ya trae sus propios
 * canales y la notificación se programa sin `channelId`. En la development build el canal se crea bien.
 */
export default async function crearCanalReportes(): Promise<boolean> {
  if (Platform.OS !== 'android' || isRunningInExpoGo()) return false;

  try {
    await Notifications.setNotificationChannelAsync(ID_CANAL_REPORTES, {
      name: 'Reportes',
      description: 'Avisos cuando se resuelve un reporte de mantenimiento.',
      importance: Notifications.AndroidImportance.HIGH,
    });
    return true;
  } catch {
    return false;
  }
}
