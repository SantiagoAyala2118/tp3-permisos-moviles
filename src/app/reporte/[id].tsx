import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import EtiquetaEstado from '@/components/EtiquetaEstado';
import FilaDato from '@/components/FilaDato';
import Tarjeta from '@/components/Tarjeta';
import useAvisarResolucion from '@/hooks/useAvisarResolucion';
import useReportes from '@/hooks/useReportes';
import describirLugar from '@/lib/reportes/describirLugar';
import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import tema from '@/lib/tema';

/** `/reporte/[id]` — Detalle del reporte. Valida el id y muestra un mensaje si no existe. */
export default function PantallaDetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarReporte, marcarResuelto } = useReportes();
  const { avisarResolucion, segundosHastaElAviso } = useAvisarResolucion();
  const [mensajeAviso, setMensajeAviso] = useState<string | null>(null);

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

  /** Botón de prueba: marca el reporte como resuelto y avisa por notificación o en la bandeja. */
  const simularResolucion = async () => {
    marcarResuelto(reporte.id);
    const canal = await avisarResolucion(reporte);
    setMensajeAviso(
      canal === 'notificacion'
        ? `Listo: en ${segundosHastaElAviso} segundos te llega la notificación.`
        : 'Listo: dejamos el aviso en la pestaña “Avisos”.',
    );
  };

  return (
    <ContenedorPantalla>
      <Tarjeta variante="destacado" estilo={estilos.heroe}>
        {reporte.fotoUri ? (
          <Image source={{ uri: reporte.fotoUri }} style={estilos.foto} contentFit="cover" />
        ) : null}
        <Text style={estilos.titulo}>{reporte.titulo}</Text>
        <EtiquetaEstado estado={reporte.estado} />
        <Text style={estilos.texto}>{reporte.descripcion || 'Sin descripción'}</Text>
      </Tarjeta>

      <Tarjeta estilo={estilos.datos}>
        <View style={estilos.filaDoble}>
          <View style={estilos.mitad}>
            <FilaDato etiqueta="Categoría" valor={etiquetasReportes.categorias[reporte.categoria]} />
          </View>
          <View style={estilos.mitad}>
            <FilaDato etiqueta="Aula" valor={reporte.aula} />
          </View>
        </View>
        <View style={estilos.filaDoble}>
          <View style={estilos.mitad}>
            <FilaDato etiqueta="Lugar" valor={describirLugar(reporte)} />
          </View>
          <View style={estilos.mitad}>
            <FilaDato
              etiqueta="Fecha"
              valor={new Date(reporte.fechaCreacion).toLocaleDateString('es-AR')}
            />
          </View>
        </View>
        {reporte.fotoUri ? null : <FilaDato etiqueta="Foto" valor="Sin foto" />}
      </Tarjeta>

      <BotonPrincipal
        titulo={estaResuelto ? 'Reporte resuelto' : 'Simular resolución'}
        icono={estaResuelto ? 'checkmark-done' : 'sparkles-outline'}
        deshabilitado={estaResuelto}
        alPresionar={simularResolucion}
      />
      {mensajeAviso ? <Text style={estilos.aviso}>{mensajeAviso}</Text> : null}
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  heroe: {
    gap: tema.espaciado.m,
    padding: tema.espaciado.l,
  },
  titulo: {
    fontSize: tema.texto.titulo + 4,
    fontWeight: '800',
    color: tema.colores.texto,
  },
  texto: {
    fontSize: tema.texto.cuerpo,
    lineHeight: 22,
    color: tema.colores.textoSuave,
  },
  aviso: {
    fontSize: tema.texto.cuerpo,
    textAlign: 'center',
    color: tema.colores.exito,
  },
  datos: {
    gap: tema.espaciado.m,
  },
  filaDoble: {
    flexDirection: 'row',
    gap: tema.espaciado.m,
  },
  mitad: {
    flex: 1,
  },
  foto: {
    width: '100%',
    height: 220,
    borderRadius: tema.radio.m,
  },
});
