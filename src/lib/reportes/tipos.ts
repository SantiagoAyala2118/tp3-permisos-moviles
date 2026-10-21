export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

/** Sectores para marcar el lugar a mano (alternativa a la ubicación). */
export type Sector = 'patio' | 'estacionamiento' | 'pasillo' | 'hall' | 'otro';

export type EstadoReporte = 'pendiente' | 'en_curso' | 'resuelto';

export type UbicacionReporte = {
  latitud: number;
  longitud: number;
  /** `true` si la persona dio solo ubicación aproximada: no se muestran coordenadas. */
  aproximada: boolean;
};

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  sector: Sector | null;
  estado: EstadoReporte;
  fechaCreacion: number;
};

/** Reporte que se está cargando en `/reporte/nuevo` y sus subpantallas. */
export type Borrador = {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria | null;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  sector: Sector | null;
};

/** Aviso de la bandeja `/avisos` (alternativa a las notificaciones). */
export type Aviso = {
  id: string;
  reporteId: string;
  titulo: string;
  mensaje: string;
  fecha: number;
};

export type EstadoReportes = {
  reportes: Reporte[];
  borrador: Borrador;
  avisos: Aviso[];
  /** Interruptor "Avisarme cuando se resuelva mi reporte". */
  preferenciaAvisos: boolean;
};

/** Acciones con nombre que entiende el reducer. */
export type AccionReportes =
  | { tipo: 'actualizarBorrador'; cambios: Partial<Borrador> }
  | { tipo: 'limpiarBorrador' }
  | { tipo: 'crearReporte'; reporte: Reporte }
  | { tipo: 'marcarResuelto'; id: string }
  | { tipo: 'agregarAviso'; aviso: Aviso }
  | { tipo: 'cambiarPreferenciaAvisos'; activa: boolean };
