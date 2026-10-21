/** Colores, espacios y bordes de toda la app (un solo lugar para cambiar el diseño). */
const tema = {
  colores: {
    primario: '#208AEF',
    primarioSuave: '#E6F4FE',
    fondo: '#F5F7FA',
    superficie: '#FFFFFF',
    texto: '#1B1F24',
    textoSuave: '#5B6470',
    borde: '#D9DEE5',
    exito: '#1E9E5A',
    alerta: '#C77A00',
    peligro: '#D64545',
  },
  espaciado: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  radio: {
    s: 8,
    m: 12,
  },
  texto: {
    titulo: 22,
    subtitulo: 17,
    cuerpo: 15,
    chico: 13,
  },
} as const;

export default tema;
