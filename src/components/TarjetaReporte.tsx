import { Pressable, StyleSheet, Text, View } from 'react-native';

import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import type { Reporte } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

import EtiquetaEstado from './EtiquetaEstado';

type Props = {
  reporte: Reporte;
  alPresionar: () => void;
};

/** Resumen de un reporte en la lista de Inicio. */
export default function TarjetaReporte({ reporte, alPresionar }: Props) {
  const categoria = etiquetasReportes.categorias[reporte.categoria];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre el detalle del reporte"
      onPress={alPresionar}
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo} numberOfLines={1}>
          {reporte.titulo}
        </Text>
        <EtiquetaEstado estado={reporte.estado} />
      </View>
      <Text style={estilos.detalle}>
        {categoria} · {reporte.aula}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: tema.espaciado.xs,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    backgroundColor: tema.colores.superficie,
  },
  presionada: {
    opacity: 0.7,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tema.espaciado.s,
  },
  titulo: {
    flex: 1,
    fontSize: tema.texto.subtitulo,
    fontWeight: '600',
    color: tema.colores.texto,
  },
  detalle: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
});
