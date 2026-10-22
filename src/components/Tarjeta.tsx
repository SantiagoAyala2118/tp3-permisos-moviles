import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  children: ReactNode;
  /** `destacado` usa un degradado más intenso (tarjeta principal de una pantalla). */
  variante?: 'normal' | 'destacado';
  estilo?: StyleProp<ViewStyle>;
};

/** Superficie base de la app: bordes muy redondeados, borde verde sutil y degradado oscuro. */
export default function Tarjeta({ children, variante = 'normal', estilo }: Props) {
  const colores = variante === 'destacado' ? tema.degradados.destacado : tema.degradados.tarjeta;

  return (
    <LinearGradient
      colors={colores}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[estilos.tarjeta, estilo]}>
      {children}
    </LinearGradient>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: tema.espaciado.s,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.l,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    overflow: 'hidden',
  },
});
