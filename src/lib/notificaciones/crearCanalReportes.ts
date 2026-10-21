import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const ID_CANAL_REPORTES = 'reportes';

/**
 * Android 8+: crea el canal "reportes". En Android 13+ el diálogo de notificaciones
 * no aparece hasta que exista al menos un canal, por eso se llama ANTES de pedir.
 * En iOS no hace nada.
 */
export default async function crearCanalReportes(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ID_CANAL_REPORTES, {
    name: 'Reportes',
    description: 'Avisos cuando se resuelve un reporte de mantenimiento.',
    importance: Notifications.AndroidImportance.HIGH,
  });
}
