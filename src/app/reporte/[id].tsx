import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import EtiquetaEstado from '@/components/EtiquetaEstado';
import FilaDato from '@/components/FilaDato';
import useReportes from '@/hooks/useReportes';
import describirLugar from '@/lib/reportes/describirLugar';
import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import tema from '@/lib/tema';

/** `/reporte/[id]` — Detalle del reporte. Valida el id y muestra un mensaje si no existe. */
export default function PantallaDetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarReporte, marcarResuelto } = useReportes();

  const reporte = typeof id === 'string' ? buscarReporte(id) : undefined;

  if (!reporte) {
    return (
      <ContenedorPantalla>
        <Text style={estilos.titulo}>No encontramos ese reporte</Text>
        <Text style={estilos.texto}>
          El reporte “{String(id ?? '')}” no existe o ya no está disponible.
        </Text>
        <BotonPrincipal titulo="Volver a mis reportes" alPresionar={() => router.replace('/')} />
      </ContenedorPantalla>
    );
  }

  const estaResuelto = reporte.estado === 'resuelto';

  return (
    <ContenedorPantalla>
      <Text style={estilos.titulo}>{reporte.titulo}</Text>
      <EtiquetaEstado estado={reporte.estado} />

      <FilaDato etiqueta="Categoría" valor={etiquetasReportes.categorias[reporte.categoria]} />
      <FilaDato etiqueta="Aula" valor={reporte.aula} />
      <FilaDato etiqueta="Descripción" valor={reporte.descripcion || 'Sin descripción'} />
      <FilaDato etiqueta="Lugar" valor={describirLugar(reporte)} />
      <FilaDato
        etiqueta="Fecha"
        valor={new Date(reporte.fechaCreacion).toLocaleDateString('es-AR')}
      />

      {reporte.fotoUri ? (
        <Image source={{ uri: reporte.fotoUri }} style={estilos.foto} contentFit="cover" />
      ) : (
        <FilaDato etiqueta="Foto" valor="Sin foto" />
      )}

      <BotonPrincipal
        titulo={estaResuelto ? 'Reporte resuelto' : 'Simular resolución'}
        variante="secundario"
        deshabilitado={estaResuelto}
        alPresionar={() => marcarResuelto(reporte.id)}
      />
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  texto: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: tema.radio.m,
  },
});
