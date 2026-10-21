import { BORRADOR_VACIO } from './estadoInicialReportes';
import type { AccionReportes, EstadoReportes } from './tipos';

/** Función pura: recibe el estado y una acción, y devuelve el estado nuevo sin modificar el anterior. */
export default function reducerReportes(
  estado: EstadoReportes,
  accion: AccionReportes,
): EstadoReportes {
  switch (accion.tipo) {
    case 'actualizarBorrador':
      return { ...estado, borrador: { ...estado.borrador, ...accion.cambios } };

    case 'limpiarBorrador':
      return { ...estado, borrador: BORRADOR_VACIO };

    case 'crearReporte':
      // El más nuevo primero.
      return { ...estado, reportes: [accion.reporte, ...estado.reportes] };

    case 'marcarResuelto':
      return {
        ...estado,
        reportes: estado.reportes.map((reporte) =>
          reporte.id === accion.id ? { ...reporte, estado: 'resuelto' } : reporte,
        ),
      };

    case 'agregarAviso':
      return { ...estado, avisos: [accion.aviso, ...estado.avisos] };

    case 'cambiarPreferenciaAvisos':
      return { ...estado, preferenciaAvisos: accion.activa };
  }
}
