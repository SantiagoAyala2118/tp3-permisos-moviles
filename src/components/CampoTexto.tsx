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
        selectionColor={tema.colores.primario}
        cursorColor={tema.colores.primario}
        multiline={multilinea}
        onSubmitEditing={alEnviar}
        style={[estilos.entrada, multilinea && estilos.multilinea]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: tema.espaciado.s,
  },
  etiqueta: {
    fontSize: tema.texto.chico,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: tema.colores.textoSuave,
  },
  entrada: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    borderRadius: tema.radio.m,
    paddingHorizontal: tema.espaciado.m,
    backgroundColor: tema.colores.superficie,
    fontSize: tema.texto.cuerpo,
    color: tema.colores.texto,
  },
  multilinea: {
    minHeight: 110,
    paddingTop: tema.espaciado.m,
    textAlignVertical: 'top',
  },
});
