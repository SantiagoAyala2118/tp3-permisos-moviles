import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import type { Categoria, Reporte } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

import EtiquetaEstado from './EtiquetaEstado';
import Tarjeta from './Tarjeta';

const ICONO_POR_CATEGORIA: Record<Categoria, ComponentProps<typeof Ionicons>['name']> = {
  electricidad: 'flash-outline',
  agua: 'water-outline',
  mobiliario: 'cube-outline',
  equipos: 'desktop-outline',
};

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
      style={({ pressed }) => pressed && estilos.presionada}>
      <Tarjeta estilo={estilos.tarjeta}>
        <View style={estilos.icono}>
          <Ionicons
            name={ICONO_POR_CATEGORIA[reporte.categoria]}
            size={22}
            color={tema.colores.primario}
          />
        </View>
        <View style={estilos.textos}>
          <Text style={estilos.titulo} numberOfLines={1}>
            {reporte.titulo}
          </Text>
          <Text style={estilos.detalle}>
            {categoria} · {reporte.aula}
          </Text>
          <EtiquetaEstado estado={reporte.estado} />
        </View>
        <Ionicons name="chevron-forward" size={20} color={tema.colores.textoSuave} />
      </Tarjeta>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.m,
  },
  presionada: {
    opacity: 0.75,
  },
  icono: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primarioSuave,
  },
  textos: {
    flex: 1,
    gap: tema.espaciado.xs + 2,
  },
  titulo: {
    fontSize: tema.texto.subtitulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  detalle: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
});
