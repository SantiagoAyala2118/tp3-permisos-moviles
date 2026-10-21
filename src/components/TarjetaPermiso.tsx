import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  nombre: string;
  estado: { texto: string; color: string };
  plataforma: string;
  matices: string[];
  nota?: string;
  /** Sin acción (ej.: ya concedido o galería), la tarjeta no muestra botón. */
  accion?: { texto: string; alPresionar: () => void };
};

/** Estado de un permiso en el panel `/permisos` (componente solo visual). */
export default function TarjetaPermiso({
  icono,
  nombre,
  estado,
  plataforma,
  matices,
  nota,
  accion,
}: Props) {
  return (
    <View style={estilos.tarjeta}>
      <View style={estilos.encabezado}>
        <Ionicons name={icono} size={24} color={tema.colores.primario} />
        <Text style={estilos.nombre}>{nombre}</Text>
        <View style={[estilos.chip, { borderColor: estado.color }]}>
          <Text style={[estilos.textoChip, { color: estado.color }]}>{estado.texto}</Text>
        </View>
      </View>

      <Text style={estilos.detalle}>Plataforma: {plataforma}</Text>
      {matices.map((matiz) => (
        <Text key={matiz} style={estilos.codigo}>
          {matiz}
        </Text>
      ))}
      {nota ? <Text style={estilos.detalle}>{nota}</Text> : null}

      {accion ? (
        <BotonPrincipal titulo={accion.texto} variante="secundario" alPresionar={accion.alPresionar} />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: tema.espaciado.s,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    backgroundColor: tema.colores.superficie,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.s,
  },
  nombre: {
    flex: 1,
    fontSize: tema.texto.subtitulo,
    fontWeight: '600',
    color: tema.colores.texto,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: tema.espaciado.s,
    paddingVertical: 2,
  },
  textoChip: {
    fontSize: tema.texto.chico,
    fontWeight: '600',
  },
  detalle: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  codigo: {
    fontSize: tema.texto.chico,
    fontFamily: 'monospace',
    color: tema.colores.texto,
  },
});
