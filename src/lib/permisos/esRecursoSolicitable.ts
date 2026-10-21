import type { RecursoSolicitable } from './tipos';

const RECURSOS_SOLICITABLES: readonly RecursoSolicitable[] = ['camara', 'ubicacion', 'notificaciones'];

/** Valida el parámetro `[recurso]` de la URL: solo estos recursos tienen pantalla previa. */
export default function esRecursoSolicitable(valor: unknown): valor is RecursoSolicitable {
  return typeof valor === 'string' && (RECURSOS_SOLICITABLES as readonly string[]).includes(valor);
}
