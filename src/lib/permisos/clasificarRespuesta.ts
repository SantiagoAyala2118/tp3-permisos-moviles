import type { EstadoPermiso, RespuestaPermiso } from './tipos';

/**
 * Traduce la respuesta del sistema a uno de los cuatro estados de la app.
 * - `granted` responde "¿lo uso?".
 * - `canAskAgain` responde "¿lo pido (Continuar) o mando a Ajustes (Abrir Ajustes)?".
 */
export default function clasificarRespuesta(respuesta: RespuestaPermiso | null): EstadoPermiso {
  if (!respuesta) return 'cargando';
  if (respuesta.granted) return 'concedido';
  if (respuesta.canAskAgain) return 'preguntable';
  return 'bloqueado';
}
