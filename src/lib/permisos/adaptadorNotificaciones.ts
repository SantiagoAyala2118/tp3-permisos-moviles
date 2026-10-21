import * as Notifications from 'expo-notifications';

import crearCanalReportes from '@/lib/notificaciones/crearCanalReportes';

import type { AdaptadorPermiso } from './tipos';

/** Notificaciones locales. En Android crea el canal "reportes" antes de pedir. */
const adaptadorNotificaciones: AdaptadorPermiso = {
  seSolicita: true,
  consultar: () => Notifications.getPermissionsAsync(),
  pedir: async () => {
    await crearCanalReportes();
    return Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
  },
};

export default adaptadorNotificaciones;
