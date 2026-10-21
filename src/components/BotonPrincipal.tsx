import { Pressable, StyleSheet, Text } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  titulo: string;
  alPresionar: () => void;
  variante?: 'primario' | 'secundario';
  deshabilitado?: boolean;
};

/** Botón de la app. `primario` = acción principal, `secundario` = acción alternativa. */
export default function BotonPrincipal({
  titulo,
  alPresionar,
  variante = 'primario',
  deshabilitado = false,
}: Props) {
  const esPrimario = variante === 'primario';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={alPresionar}
      style={({ pressed }) => [
        estilos.boton,
        esPrimario ? estilos.primario : estilos.secundario,
        (pressed || deshabilitado) && estilos.atenuado,
      ]}>
      <Text style={[estilos.texto, esPrimario ? estilos.textoPrimario : estilos.textoSecundario]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 48,
    borderRadius: tema.radio.m,
    paddingHorizontal: tema.espaciado.m,
    paddingVertical: tema.espaciado.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: {
    backgroundColor: tema.colores.primario,
  },
  secundario: {
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.primario,
  },
  atenuado: {
    opacity: 0.6,
  },
  texto: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '600',
  },
  textoPrimario: {
    color: tema.colores.superficie,
  },
  textoSecundario: {
    color: tema.colores.primario,
  },
});
