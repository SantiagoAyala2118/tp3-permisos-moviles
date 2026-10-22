import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Aviso } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

import Tarjeta from './Tarjeta';

type Props = {
  aviso: Aviso;
  alPresionar: () => void;
};

/** Un aviso de la bandeja `/avisos`. */
export default function TarjetaAviso({ aviso, alPresionar }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Abre el reporte del aviso"
      onPress={alPresionar}
      style={({ pressed }) => pressed && estilos.presionada}>
      <Tarjeta estilo={estilos.tarjeta}>
        <View style={estilos.icono}>
          <Ionicons name="checkmark-done" size={22} color={tema.colores.sobrePrimario} />
        </View>
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>{aviso.titulo}</Text>
          <Text style={estilos.mensaje}>{aviso.mensaje}</Text>
          <Text style={estilos.fecha}>{new Date(aviso.fecha).toLocaleString('es-AR')}</Text>
        </View>
      </Tarjeta>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tema.espaciado.m,
  },
  presionada: {
    opacity: 0.75,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.exito,
  },
  textos: {
    flex: 1,
    gap: tema.espaciado.xs,
  },
  titulo: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  mensaje: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.texto,
  },
  fecha: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
});
