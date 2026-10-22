import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: 'primario' | 'secundario';
  deshabilitado?: boolean;
  icono?: ComponentProps<typeof Ionicons>['name'];
};

/**
 * Botón píldora de la app.
 * - `primario`: degradado esmeralda con texto oscuro (acción principal).
 * - `secundario`: contorno verde sobre fondo transparente (acción alternativa).
 */
export default function BotonPrincipal({
  titulo,
  alPresionar,
  variante = 'primario',
  deshabilitado = false,
  icono,
}: Props) {
  const esPrimario = variante === 'primario';
  const colorContenido = esPrimario ? tema.colores.sobrePrimario : tema.colores.texto;

  const contenido = (
    <View style={estilos.contenido}>
      {icono ? <Ionicons name={icono} size={18} color={colorContenido} /> : null}
      <Text numberOfLines={1} style={[estilos.texto, { color: colorContenido }]}>
        {titulo}
      </Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={alPresionar}
      style={({ pressed }) => [
        estilos.boton,
        !esPrimario && estilos.secundario,
        (pressed || deshabilitado) && estilos.atenuado,
      ]}>
      {esPrimario ? (
        <LinearGradient
          colors={tema.degradados.boton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={estilos.relleno}>
          {contenido}
        </LinearGradient>
      ) : (
        <View style={estilos.relleno}>{contenido}</View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 52,
    borderRadius: tema.radio.pildora,
    overflow: 'hidden',
  },
  secundario: {
    borderWidth: 1,
    borderColor: tema.paleta.pino,
    backgroundColor: tema.colores.superficie,
  },
  relleno: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: tema.espaciado.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenido: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.s,
  },
  atenuado: {
    opacity: 0.55,
  },
  texto: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
