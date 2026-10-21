import type { RespuestaPermiso } from './tipos';

/** `true` si la persona concedió menos de lo pedido: fotos limitadas o ubicación aproximada. */
export default function esAccesoParcial(respuesta: RespuestaPermiso | null): boolean {
  if (!respuesta?.granted) return false;

  const fotosLimitadas = respuesta.accessPrivileges === 'limited';
  const ubicacionAproximada =
    respuesta.android?.accuracy === 'coarse' || respuesta.ios?.accuracy === 'reduced';

  return fotosLimitadas || ubicacionAproximada;
}
