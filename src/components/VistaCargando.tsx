import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  mensaje?: string;
};

/** Estado "cargando": se muestra mientras el sistema responde el estado de un permiso. */
export default function VistaCargando({ mensaje = 'Consultando permisos…' }: Props) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      <ActivityIndicator size="large" color={tema.colores.primario} />
      <Text style={estilos.mensaje}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tema.espaciado.m,
    padding: tema.espaciado.l,
    backgroundColor: tema.colores.fondo,
  },
  mensaje: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
});
