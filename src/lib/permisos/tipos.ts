import type { PermissionResponse } from 'expo';
import type { IosAuthorizationStatus } from 'expo-notifications';

/** Recursos del dispositivo que maneja la app. */
export type Recurso = 'camara' | 'ubicacion' | 'notificaciones' | 'galeria';

/** Los cuatro estados con los que trabaja toda la app. */
export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

/**
 * Unión mínima de lo que devuelven los módulos de Expo.
 * Todos comparten `PermissionResponse` y algunos suman matices propios.
 */
export type RespuestaPermiso = PermissionResponse & {
  /** expo-image-picker / expo-media-library: fotos limitadas. */
  accessPrivileges?: 'all' | 'limited' | 'none';
  /** expo-location (accuracy) y expo-notifications (importance) en Android. */
  android?: { accuracy?: 'fine' | 'coarse' | 'none'; importance?: number };
  /** expo-location (accuracy, scope) y expo-notifications (status) en iOS. */
  ios?: {
    accuracy?: 'full' | 'reduced';
    scope?: 'whenInUse' | 'always' | 'none';
    status?: IosAuthorizationStatus;
  };
};

/** Interfaz común que cumple cada adaptador (patrón Adapter). */
export type AdaptadorPermiso = {
  /** `false` cuando la app nunca pide el permiso (ej. galería: usa el selector del sistema). */
  seSolicita: boolean;
  /** Solo consulta: nunca muestra el diálogo. */
  consultar: () => Promise<RespuestaPermiso>;
  /** Pide el permiso: puede mostrar el diálogo del sistema. */
  pedir: () => Promise<RespuestaPermiso>;
};

/** Lo que devuelve el hook `usePermiso`. */
export type ResultadoPermiso = {
  estado: EstadoPermiso;
  /** Fotos limitadas o ubicación aproximada. */
  parcial: boolean;
  /** Respuesta cruda del sistema (para mostrar matices en el panel). */
  respuesta: RespuestaPermiso | null;
  seSolicita: boolean;
  pedir: () => Promise<RespuestaPermiso>;
  consultar: () => Promise<RespuestaPermiso>;
  abrirAjustes: () => Promise<void>;
};

/** Textos que se muestran al pedir o explicar un permiso. */
export type TextosPermiso = {
  nombre: string;
  titulo: string;
  /** El beneficio, en una frase. */
  beneficio: string;
  /** Camino exacto en Ajustes para habilitarlo, por plataforma. */
  pasosAjustes: { android: string; ios: string };
};
