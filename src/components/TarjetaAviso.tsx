import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Aviso } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

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
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}>
      <Ionicons name="checkmark-circle-outline" size={28} color={tema.colores.exito} />
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{aviso.titulo}</Text>
        <Text style={estilos.mensaje}>{aviso.mensaje}</Text>
        <Text style={estilos.fecha}>{new Date(aviso.fecha).toLocaleString('es-AR')}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: tema.espaciado.m,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    backgroundColor: tema.colores.superficie,
  },
  presionada: {
    opacity: 0.7,
  },
  textos: {
    flex: 1,
    gap: tema.espaciado.xs,
  },
  titulo: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '600',
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
