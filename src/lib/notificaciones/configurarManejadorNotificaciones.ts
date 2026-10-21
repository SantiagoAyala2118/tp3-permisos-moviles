import * as Notifications from './moduloNotificaciones';

/**
 * Define qué hace la app cuando llega una notificación con la app ABIERTA:
 * mostrarla como banner y dejarla en la lista. Se llama una sola vez, al iniciar.
 */
export default function configurarManejadorNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
