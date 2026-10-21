import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  etiqueta: string;
  valor: string;
};

/** Par "etiqueta: valor" para mostrar datos (detalle del reporte, panel de permisos). */
export default function FilaDato({ etiqueta, valor }: Props) {
  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    gap: 2,
  },
  etiqueta: {
    fontSize: tema.texto.chico,
    fontWeight: '600',
    color: tema.colores.textoSuave,
  },
  valor: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.texto,
  },
});
