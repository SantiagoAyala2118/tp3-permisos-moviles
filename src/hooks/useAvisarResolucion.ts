import programarAvisoResolucion, {
  SEGUNDOS_HASTA_EL_AVISO,
} from '@/lib/notificaciones/programarAvisoResolucion';
import type { Reporte } from '@/lib/reportes/tipos';

import usePermiso from './usePermiso';
import useReportes from './useReportes';

export type CanalDeAviso = 'notificacion' | 'bandeja';

/**
 * Decide CÓMO avisar que un reporte se resolvió (RF-5 y RF-7):
 * - Interruptor activo + permiso concedido → notificación local a los 10 segundos.
 * - Si no (o si falla) → aviso en la bandeja `/avisos`, la alternativa a las notificaciones.
 */
export default function useAvisarResolucion() {
  const { preferenciaAvisos, agregarAviso } = useReportes();
  const { estado } = usePermiso('notificaciones'); // solo consulta: nunca pide

  const conNotificacion = preferenciaAvisos && estado === 'concedido';

  const avisarResolucion = async (reporte: Reporte): Promise<CanalDeAviso> => {
    if (conNotificacion) {
      try {
        await programarAvisoResolucion(reporte);
        return 'notificacion';
      } catch {
        // Si no se pudo programar, la bandeja asegura que el aviso no se pierda.
      }
    }

    agregarAviso({
      reporteId: reporte.id,
      titulo: '¡Reporte resuelto!',
      mensaje: `“${reporte.titulo}” (${reporte.aula}) ya fue resuelto.`,
    });
    return 'bandeja';
  };

  return { conNotificacion, avisarResolucion, segundosHastaElAviso: SEGUNDOS_HASTA_EL_AVISO };
}
