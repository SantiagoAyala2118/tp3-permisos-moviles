import { Platform } from 'react-native';

import type { TextosPermiso } from './tipos';

/** Camino exacto en Ajustes para la plataforma en la que corre la app. */
export default function obtenerPasosAjustes(textos: TextosPermiso): string {
  return Platform.OS === 'ios' ? textos.pasosAjustes.ios : textos.pasosAjustes.android;
}
