import { StyleSheet, Text, TextInput, View } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  etiqueta: string;
  valor: string;
  alCambiar: (texto: string) => void;
  marcador?: string;
  multilinea?: boolean;
  alEnviar?: () => void;
};

/** Campo de texto con su etiqueta. */
export default function CampoTexto({
  etiqueta,
  valor,
  alCambiar,
  marcador,
  multilinea = false,
  alEnviar,
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <TextInput
        accessibilityLabel={etiqueta}
        value={valor}
        onChangeText={alCambiar}
        placeholder={marcador}
        placeholderTextColor={tema.colores.textoSuave}
        multiline={multilinea}
        onSubmitEditing={alEnviar}
        style={[estilos.entrada, multilinea && estilos.multilinea]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: tema.espaciado.xs,
  },
  etiqueta: {
    fontSize: tema.texto.chico,
    fontWeight: '600',
    color: tema.colores.textoSuave,
  },
  entrada: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radio.s,
    paddingHorizontal: tema.espaciado.m,
    backgroundColor: tema.colores.superficie,
    fontSize: tema.texto.cuerpo,
    color: tema.colores.texto,
  },
  multilinea: {
    minHeight: 96,
    paddingTop: tema.espaciado.s,
    textAlignVertical: 'top',
  },
});
