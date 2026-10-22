import type { EstadoReporte, Reporte } from './tipos';

/** Cuántos reportes hay en cada estado (para el resumen de Inicio). */
export default function contarPorEstado(reportes: Reporte[]): Record<EstadoReporte, number> {
  const conteo: Record<EstadoReporte, number> = { pendiente: 0, en_curso: 0, resuelto: 0 };
  for (const reporte of reportes) conteo[reporte.estado] += 1;
  return conteo;
}
