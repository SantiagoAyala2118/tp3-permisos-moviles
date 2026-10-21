import adaptadorCamara from './adaptadorCamara';
import adaptadorGaleria from './adaptadorGaleria';
import adaptadorNotificaciones from './adaptadorNotificaciones';
import adaptadorUbicacion from './adaptadorUbicacion';
import type { AdaptadorPermiso, Recurso } from './tipos';

/**
 * Mapa recurso → adaptador (patrón Registry / Strategy).
 * Para sumar un recurso nuevo (ej. micrófono) alcanza con crear su adaptador
 * y agregarlo acá: `usePermiso` no se toca (principio Abierto/Cerrado).
 */
const registroAdaptadores: Record<Recurso, AdaptadorPermiso> = {
  camara: adaptadorCamara,
  ubicacion: adaptadorUbicacion,
  notificaciones: adaptadorNotificaciones,
  galeria: adaptadorGaleria,
};

export default registroAdaptadores;
