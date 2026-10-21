import etiquetasReportes from './etiquetasReportes';
import type { Sector, UbicacionReporte } from './tipos';

type Lugar = {
  ubicacion: UbicacionReporte | null;
  sector: Sector | null;
};

/**
 * Texto del lugar del problema.
 * - Ubicación aproximada → "Ubicación aproximada" (nunca coordenadas exactas, RF-4).
 * - Ubicación precisa → coordenadas.
 * - Sin ubicación → el sector elegido a mano.
 */
export default function describirLugar({ ubicacion, sector }: Lugar): string {
  if (ubicacion) {
    if (ubicacion.aproximada) return 'Ubicación aproximada';
    return `${ubicacion.latitud.toFixed(5)}, ${ubicacion.longitud.toFixed(5)}`;
  }
  if (sector) return etiquetasReportes.sectores[sector];
  return 'Sin ubicación';
}
