import * as Notifications from './moduloNotificaciones';

import type { Reporte } from '@/lib/reportes/tipos';

import crearCanalReportes, { ID_CANAL_REPORTES } from './crearCanalReportes';

export const SEGUNDOS_HASTA_EL_AVISO = 10;

/**
 * Programa una notificación LOCAL a los 10 segundos avisando que el reporte se resolvió (RF-5).
 * Antes se asegura de que exista el canal "reportes" (Android): crearlo de nuevo no tiene efecto.
 */
export default async function programarAvisoResolucion(reporte: Reporte): Promise<void> {
  await crearCanalReportes();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¡Reporte resuelto!',
      body: `“${reporte.titulo}” (${reporte.aula}) ya fue resuelto. ¡Gracias por avisar!`,
      data: { reporteId: reporte.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_HASTA_EL_AVISO,
      channelId: ID_CANAL_REPORTES,
    },
  });
}
