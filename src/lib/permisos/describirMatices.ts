import type { RespuestaPermiso } from './tipos';

/**
 * Lista los campos crudos de la respuesta que explican el estado (RF-9):
 * `status` y `canAskAgain` siempre, y los matices `accessPrivileges` / `accuracy` cuando existen.
 */
export default function describirMatices(respuesta: RespuestaPermiso | null): string[] {
  if (!respuesta) return [];

  const matices = [`status: '${respuesta.status}' · canAskAgain: ${respuesta.canAskAgain}`];

  if (respuesta.accessPrivileges) {
    matices.push(`accessPrivileges: '${respuesta.accessPrivileges}'`);
  }
  if (respuesta.android?.accuracy) {
    matices.push(`android.accuracy: '${respuesta.android.accuracy}'`);
  }
  if (respuesta.ios?.accuracy) {
    matices.push(`ios.accuracy: '${respuesta.ios.accuracy}'`);
  }

  return matices;
}
