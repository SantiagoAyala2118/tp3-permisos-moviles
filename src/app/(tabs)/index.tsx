import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import tema from '@/lib/tema';

/** Lista provisoria para comprobar a mano que todas las URLs responden (se reemplaza en TASK 5). */
const RUTAS_DE_PRUEBA: Href[] = [
  '/reporte/nuevo',
  '/reporte/escanear',
  '/reporte/foto',
  '/reporte/ubicacion',
  '/reporte/123',
  '/avisos',
  '/permisos',
  '/permisos/camara',
  '/ajustes-app',
];

/** `/` — Inicio (tab "Reportes"). */
export default function PantallaInicio() {
  return (
    <ContenedorPantalla>
      <Text style={estilos.titulo}>Mis reportes</Text>
      <Text style={estilos.detalle}>Pantalla en construcción. Rutas para probar:</Text>
      {RUTAS_DE_PRUEBA.map((ruta) => (
        <Link key={String(ruta)} href={ruta} style={estilos.enlace}>
          {String(ruta)}
        </Link>
      ))}
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
  enlace: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.primario,
    paddingVertical: tema.espaciado.xs,
  },
});
