import { router, type Href } from 'expo-router';

import type { RecursoSolicitable, ResultadoPermiso } from '@/lib/permisos/tipos';

import usePermiso from './usePermiso';

type ResultadoNavegarConPermiso = ResultadoPermiso & {
  /**
   * Se llama SOLO desde un `onPress` ("pedir en contexto", RF-6 y RF-8).
   * - Concedido: navega al `destino` (si hay) y devuelve `true` para que la pantalla siga con su acción.
   * - Si no: abre la pantalla previa `/permisos/[recurso]` y devuelve `false`.
   */
  irConPermiso: (destino?: Href) => boolean;
};

export default function useNavegarConPermiso(
  recurso: RecursoSolicitable,
): ResultadoNavegarConPermiso {
  const permiso = usePermiso(recurso);

  const irConPermiso = (destino?: Href) => {
    if (permiso.estado === 'concedido') {
      if (destino) router.push(destino);
      return true;
    }

    router.push({
      pathname: '/permisos/[recurso]',
      params: destino ? { recurso, destino: String(destino) } : { recurso },
    });
    return false;
  };

  return { ...permiso, irConPermiso };
}
