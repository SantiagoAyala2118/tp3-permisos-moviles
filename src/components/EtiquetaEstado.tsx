import { StyleSheet, Text, View } from 'react-native';

import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import type { EstadoReporte } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

const COLOR_POR_ESTADO: Record<EstadoReporte, string> = {
  pendiente: tema.colores.alerta,
  en_curso: tema.colores.primario,
  resuelto: tema.colores.exito,
};

type Props = {
  estado: EstadoReporte;
};

/** Chip con el estado del reporte (pendiente, en curso, resuelto). */
export default function EtiquetaEstado({ estado }: Props) {
  const color = COLOR_POR_ESTADO[estado];

  return (
    <View style={[estilos.chip, { borderColor: color }]}>
      <Text style={[estilos.texto, { color }]}>{etiquetasReportes.estados[estado]}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: tema.espaciado.s,
    paddingVertical: 2,
  },
  texto: {
    fontSize: tema.texto.chico,
    fontWeight: '600',
  },
});
