import * as Location from 'expo-location';

import type { UbicacionReporte } from '@/lib/reportes/tipos';

/**
 * Devuelve la ubicación actual y si es APROXIMADA (receta E2 c), o `null` si no se puede obtener.
 * - No pide el permiso: eso lo hace la pantalla previa. Acá solo se CONSULTA.
 * - Aproximada: Android `accuracy: 'coarse'` o iOS `accuracy: 'reduced'`.
 * - Si se denegó, o el GPS está apagado, devuelve `null` sin romper la app.
 */
export default async function obtenerUbicacion(): Promise<UbicacionReporte | null> {
  try {
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const aproximada =
      permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return { latitud: coords.latitude, longitud: coords.longitude, aproximada };
  } catch {
    return null;
  }
}
