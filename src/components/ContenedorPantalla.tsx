import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  children: ReactNode;
  /** Pantallas de los tabs: dejan espacio abajo para la barra flotante. */
  conBarraTabs?: boolean;
};

/** Contenedor común de las pantallas: fondo, márgenes y desplazamiento. */
export default function ContenedorPantalla({ children, conBarraTabs = false }: Props) {
  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={[estilos.contenido, conBarraTabs && estilos.conBarraTabs]}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
  },
  contenido: {
    padding: tema.espaciado.m,
    paddingBottom: tema.espaciado.xl,
    gap: tema.espaciado.m,
  },
  conBarraTabs: {
    paddingBottom: tema.altoBarraTabs + tema.espaciado.l,
  },
});
