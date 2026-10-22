import { StyleSheet, Text, View } from 'react-native';

import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import type { EstadoReporte } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

type EstiloEstado = { color: string; relleno: boolean };

/** Pendiente y En curso van con contorno; Resuelto va "encendido" (relleno). */
const ESTILO_POR_ESTADO: Record<EstadoReporte, EstiloEstado> = {
  pendiente: { color: tema.colores.alerta, relleno: false },
  en_curso: { color: tema.colores.primario, relleno: false },
  resuelto: { color: tema.colores.exito, relleno: true },
};

type Props = {
  estado: EstadoReporte;
};

/** Chip píldora con el estado del reporte (pendiente, en curso, resuelto). */
export default function EtiquetaEstado({ estado }: Props) {
  const { color, relleno } = ESTILO_POR_ESTADO[estado];

  return (
    <View
      style={[
        estilos.chip,
        { borderColor: color },
        relleno && { backgroundColor: color },
      ]}>
      <View style={[estilos.punto, { backgroundColor: relleno ? tema.colores.sobrePrimario : color }]} />
      <Text style={[estilos.texto, { color: relleno ? tema.colores.sobrePrimario : color }]}>
        {etiquetasReportes.estados[estado]}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: tema.radio.pildora,
    paddingHorizontal: tema.espaciado.s + 2,
    paddingVertical: 4,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  texto: {
    fontSize: tema.texto.chico,
    fontWeight: '700',
  },
});
