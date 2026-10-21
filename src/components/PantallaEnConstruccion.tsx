import { StyleSheet, Text } from 'react-native';

import tema from '@/lib/tema';

import ContenedorPantalla from './ContenedorPantalla';

type Props = {
  titulo: string;
  detalle?: string;
};

/**
 * Contenido provisorio de una ruta (TASK 4): confirma que la URL existe.
 * Cada pantalla lo reemplaza por su contenido real en las tareas siguientes.
 */
export default function PantallaEnConstruccion({ titulo, detalle }: Props) {
  return (
    <ContenedorPantalla>
      <Text style={estilos.titulo}>{titulo}</Text>
      {detalle ? <Text style={estilos.detalle}>{detalle}</Text> : null}
      <Text style={estilos.detalle}>Pantalla en construcción.</Text>
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  detalle: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
});
