import type { Categoria, EstadoReporte, Sector } from './tipos';

/** Textos visibles de cada valor (separados de la lógica para poder cambiarlos sin tocarla). */
const etiquetasReportes = {
  categorias: {
    electricidad: 'Electricidad',
    agua: 'Agua',
    mobiliario: 'Mobiliario',
    equipos: 'Equipos',
  } satisfies Record<Categoria, string>,
  sectores: {
    patio: 'Patio',
    estacionamiento: 'Estacionamiento',
    pasillo: 'Pasillo',
    hall: 'Hall de entrada',
    otro: 'Otro sector',
  } satisfies Record<Sector, string>,
  estados: {
    pendiente: 'Pendiente',
    en_curso: 'En curso',
    resuelto: 'Resuelto',
  } satisfies Record<EstadoReporte, string>,
};

export default etiquetasReportes;
