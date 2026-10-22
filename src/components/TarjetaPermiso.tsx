import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';
import Tarjeta from './Tarjeta';

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
    <Tarjeta estilo={estilos.tarjeta}>
      <View style={estilos.encabezado}>
        <View style={estilos.icono}>
          <Ionicons name={icono} size={22} color={tema.colores.primario} />
        </View>
        <View style={estilos.titulos}>
          <Text style={estilos.nombre}>{nombre}</Text>
          <Text style={estilos.detalle}>Plataforma: {plataforma}</Text>
        </View>
        <View style={[estilos.chip, { borderColor: estado.color }]}>
          <View style={[estilos.punto, { backgroundColor: estado.color }]} />
          <Text style={[estilos.textoChip, { color: estado.color }]}>{estado.texto}</Text>
        </View>
      </View>

      {matices.length > 0 ? (
        <View style={estilos.consola}>
          {matices.map((matiz) => (
            <Text key={matiz} style={estilos.codigo}>
              {matiz}
            </Text>
          ))}
        </View>
      ) : null}
      {nota ? <Text style={estilos.detalle}>{nota}</Text> : null}

      {accion ? (
        <BotonPrincipal titulo={accion.texto} variante="secundario" alPresionar={accion.alPresionar} />
      ) : null}
    </Tarjeta>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: tema.espaciado.m,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.m,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primarioSuave,
  },
  titulos: {
    flex: 1,
    gap: 2,
  },
  nombre: {
    fontSize: tema.texto.subtitulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  chip: {
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
  textoChip: {
    fontSize: tema.texto.chico,
    fontWeight: '700',
  },
  detalle: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  consola: {
    gap: tema.espaciado.xs,
    padding: tema.espaciado.s + 4,
    borderRadius: tema.radio.s,
    backgroundColor: tema.colores.fondo,
  },
  codigo: {
    fontSize: tema.texto.chico,
    fontFamily: tema.fuenteMonoespaciada,
    color: tema.colores.exito,
  },
});
