import { Pressable, StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

type Props<T extends string> = {
  etiqueta: string;
  /** Mapa valor → texto visible (por ejemplo, `etiquetasReportes.categorias`). */
  opciones: Record<T, string>;
  seleccionada: T | null;
  alElegir: (valor: T) => void;
};

/** Grupo de chips para elegir una opción. Se usa para la categoría y para el sector. */
export default function SelectorOpciones<T extends string>({
  etiqueta,
  opciones,
  seleccionada,
  alElegir,
}: Props<T>) {
  const valores = Object.keys(opciones) as T[];

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <View style={estilos.chips} accessibilityRole="radiogroup">
        {valores.map((valor) => {
          const activa = valor === seleccionada;
          return (
            <Pressable
              key={valor}
              accessibilityRole="radio"
              accessibilityState={{ checked: activa }}
              onPress={() => alElegir(valor)}
              style={[estilos.chip, activa && estilos.chipActivo]}>
              <Text style={[estilos.textoChip, activa && estilos.textoChipActivo]}>
                {opciones[valor]}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tema.espaciado.s,
  },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: tema.espaciado.m,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    backgroundColor: tema.colores.superficie,
  },
  chipActivo: {
    borderColor: tema.colores.primario,
    backgroundColor: tema.colores.primarioSuave,
  },
  textoChip: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.texto,
  },
  textoChipActivo: {
    color: tema.colores.primario,
    fontWeight: '600',
  },
});
