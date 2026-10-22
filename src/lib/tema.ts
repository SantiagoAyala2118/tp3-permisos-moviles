import { Platform } from 'react-native';

/**
 * Paleta base (de oscuro a claro):
 * #09110D (noche) · #0B3221 (bosque) · #135E3D (pino) · #1AA06D (esmeralda).
 */
const paleta = {
  noche: '#09110D',
  bosque: '#0B3221',
  pino: '#135E3D',
  esmeralda: '#1AA06D',
} as const;

/** Colores, espacios, bordes y degradados de toda la app (un solo lugar para cambiar el diseño). */
const tema = {
  paleta,
  colores: {
    primario: paleta.esmeralda,
    /** Fondo suave para íconos y chips activos. */
    primarioSuave: 'rgba(26, 160, 109, 0.16)',
    /** Texto e íconos que van ENCIMA de un fondo `primario`. */
    sobrePrimario: paleta.noche,
    fondo: paleta.noche,
    superficie: paleta.bosque,
    superficieElevada: '#0F4129',
    texto: '#EAF5EF',
    textoSuave: '#8FB8A5',
    borde: 'rgba(26, 160, 109, 0.28)',
    exito: '#2FD08F',
    alerta: '#F2B84B',
    peligro: '#FF6B6B',
    sombra: '#000000',
  },
  /** Degradados (para `expo-linear-gradient`). */
  degradados: {
    tarjeta: [paleta.bosque, '#0A2418'] as const,
    destacado: [paleta.pino, paleta.bosque, paleta.noche] as const,
    boton: ['#22B87E', paleta.esmeralda] as const,
  },
  espaciado: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  radio: {
    s: 12,
    m: 20,
    l: 28,
    pildora: 999,
  },
  texto: {
    gigante: 30,
    titulo: 22,
    subtitulo: 17,
    cuerpo: 15,
    chico: 13,
  },
  fuenteMonoespaciada: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  /** Alto de la barra de tabs flotante + margen: las pantallas de tabs dejan este espacio abajo. */
  altoBarraTabs: 96,
} as const;

export default tema;
