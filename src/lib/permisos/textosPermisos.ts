import type { Recurso, TextosPermiso } from './tipos';

/** Aclaración que acompaña a toda pantalla previa (transparencia). */
export const ACLARACION_AJUSTES = 'Podés cambiarlo cuando quieras en Ajustes.';

/**
 * Textos de cada recurso. El beneficio repite, con el tono de la app,
 * lo mismo que dice el texto de propósito de `app.json`.
 */
const textosPermisos: Record<Recurso, TextosPermiso> = {
  camara: {
    nombre: 'Cámara',
    icono: 'camera-outline',
    titulo: 'Usá la cámara para tu reporte',
    beneficio:
      'Usamos la cámara para leer el código QR de la puerta del aula y sacar la foto del desperfecto. Solo se activa mientras la usás.',
    pasosAjustes: {
      android: 'Ajustes → Apps → Mantenimiento IPF → Permisos → Cámara → "Permitir solo mientras se usa la app".',
      ios: 'Ajustes → Mantenimiento IPF → activá "Cámara".',
    },
  },
  ubicacion: {
    nombre: 'Ubicación',
    icono: 'location-outline',
    titulo: 'Marcá dónde está el problema',
    beneficio:
      'Usamos tu ubicación para marcar en qué lugar del instituto está el desperfecto. Solo mientras usás la app.',
    pasosAjustes: {
      android: 'Ajustes → Apps → Mantenimiento IPF → Permisos → Ubicación → "Permitir solo mientras se usa la app".',
      ios: 'Ajustes → Mantenimiento IPF → Ubicación → "Al usar la app".',
    },
  },
  notificaciones: {
    nombre: 'Notificaciones',
    icono: 'notifications-outline',
    titulo: 'Enterate cuando se resuelva',
    beneficio: 'Te avisamos con una notificación cuando se resuelva el desperfecto que reportaste.',
    pasosAjustes: {
      android: 'Ajustes → Apps → Mantenimiento IPF → Notificaciones → activá "Todas las notificaciones".',
      ios: 'Ajustes → Mantenimiento IPF → Notificaciones → activá "Permitir notificaciones".',
    },
  },
  galeria: {
    nombre: 'Galería de fotos',
    icono: 'images-outline',
    titulo: 'Tus fotos',
    beneficio:
      'No necesitamos permiso: para adjuntar una foto usamos el selector del sistema y solo recibimos la que elegís.',
    pasosAjustes: {
      android: 'No hace falta habilitar nada.',
      ios: 'No hace falta habilitar nada.',
    },
  },
};

export default textosPermisos;
