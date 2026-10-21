import type { Borrador, EstadoReportes } from './tipos';

export const BORRADOR_VACIO: Borrador = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: null,
  fotoUri: null,
  ubicacion: null,
  sector: null,
};

const UN_DIA = 24 * 60 * 60 * 1000;
const ahora = Date.now();

/** Datos de ejemplo: un reporte por estado, para que la lista no arranque vacía. */
const estadoInicialReportes: EstadoReportes = {
  reportes: [
    {
      id: 'ejemplo-1',
      titulo: 'Proyector roto',
      descripcion: 'El proyector no enciende aunque está enchufado.',
      aula: 'AULA-12',
      categoria: 'equipos',
      fotoUri: null,
      ubicacion: null,
      sector: null,
      estado: 'pendiente',
      fechaCreacion: ahora - UN_DIA,
    },
    {
      id: 'ejemplo-2',
      titulo: 'Canilla que pierde',
      descripcion: 'La canilla del baño de planta baja gotea todo el día.',
      aula: 'BANIO-PB',
      categoria: 'agua',
      fotoUri: null,
      ubicacion: null,
      sector: 'pasillo',
      estado: 'en_curso',
      fechaCreacion: ahora - 3 * UN_DIA,
    },
    {
      id: 'ejemplo-3',
      titulo: 'Luz quemada',
      descripcion: 'Tubo fluorescente quemado sobre el pizarrón.',
      aula: 'AULA-04',
      categoria: 'electricidad',
      fotoUri: null,
      ubicacion: null,
      sector: null,
      estado: 'resuelto',
      fechaCreacion: ahora - 7 * UN_DIA,
    },
  ],
  borrador: BORRADOR_VACIO,
  avisos: [],
  preferenciaAvisos: false,
};

export default estadoInicialReportes;
