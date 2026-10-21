import tema from '@/lib/tema';

import type { EstadoPermiso } from './tipos';

type DescripcionEstado = {
  texto: string;
  color: string;
};

/**
 * Texto y color del estado para el panel de permisos.
 * "Parcial" es un concedido con matiz: fotos limitadas o ubicación aproximada.
 */
export default function describirEstadoPermiso(
  estado: EstadoPermiso,
  parcial: boolean,
): DescripcionEstado {
  switch (estado) {
    case 'cargando':
      return { texto: 'Consultando…', color: tema.colores.textoSuave };
    case 'concedido':
      return parcial
        ? { texto: 'Parcial', color: tema.colores.alerta }
        : { texto: 'Concedido', color: tema.colores.exito };
    case 'preguntable':
      return { texto: 'Preguntable', color: tema.colores.primario };
    case 'bloqueado':
      return { texto: 'Bloqueado', color: tema.colores.peligro };
  }
}
