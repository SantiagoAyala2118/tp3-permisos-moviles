import * as Location from 'expo-location';

import type { AdaptadorPermiso } from './tipos';

/** Ubicación SOLO en primer plano (mínimo privilegio): la app nunca pide segundo plano. */
const adaptadorUbicacion: AdaptadorPermiso = {
  seSolicita: true,
  consultar: () => Location.getForegroundPermissionsAsync(),
  pedir: () => Location.requestForegroundPermissionsAsync(),
};

export default adaptadorUbicacion;
