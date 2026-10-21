import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import tema from '@/lib/tema';

type Props = {
  children: ReactNode;
};

/** Contenedor común de las pantallas: fondo, márgenes y desplazamiento. */
export default function ContenedorPantalla({ children }: Props) {
  return (
    <ScrollView
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenido}
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
    gap: tema.espaciado.m,
  },
});
