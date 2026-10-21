import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import CampoTexto from '@/components/CampoTexto';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import FilaDato from '@/components/FilaDato';
import SelectorOpciones from '@/components/SelectorOpciones';
import useReportes from '@/hooks/useReportes';
import describirLugar from '@/lib/reportes/describirLugar';
import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import validarBorrador from '@/lib/reportes/validarBorrador';
import tema from '@/lib/tema';

/**
 * `/reporte/nuevo` — Formulario del reporte.
 * No pide ningún permiso al abrir: cada permiso se pide recién al tocar su función.
 */
export default function PantallaNuevoReporte() {
  const { borrador, actualizarBorrador, crearReporte } = useReportes();
  const [errores, setErrores] = useState<string[]>([]);

  const guardar = () => {
    const problemas = validarBorrador(borrador);
    setErrores(problemas);
    if (problemas.length > 0) return;

    const id = crearReporte();
    router.replace({ pathname: '/reporte/[id]', params: { id } });
  };

  return (
    <ContenedorPantalla>
      <CampoTexto
        etiqueta="Título"
        valor={borrador.titulo}
        alCambiar={(titulo) => actualizarBorrador({ titulo })}
        marcador="Ej.: Luz quemada"
      />
      <CampoTexto
        etiqueta="Descripción"
        valor={borrador.descripcion}
        alCambiar={(descripcion) => actualizarBorrador({ descripcion })}
        marcador="Contanos qué pasa"
        multilinea
      />
      <CampoTexto
        etiqueta="Aula"
        valor={borrador.aula}
        alCambiar={(aula) => actualizarBorrador({ aula })}
        marcador="Escaneá el QR o escribila (ej.: AULA-12)"
      />
      <BotonPrincipal
        titulo="Escanear QR del aula"
        variante="secundario"
        alPresionar={() => router.push('/reporte/escanear')}
      />

      <SelectorOpciones
        etiqueta="Categoría"
        opciones={etiquetasReportes.categorias}
        seleccionada={borrador.categoria}
        alElegir={(categoria) => actualizarBorrador({ categoria })}
      />

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>Adjuntos (opcionales)</Text>
        {borrador.fotoUri ? (
          <Image source={{ uri: borrador.fotoUri }} style={estilos.miniatura} contentFit="cover" />
        ) : null}
        <BotonPrincipal
          titulo={borrador.fotoUri ? 'Cambiar foto' : 'Adjuntar foto'}
          variante="secundario"
          alPresionar={() => router.push('/reporte/foto')}
        />
        <FilaDato etiqueta="Lugar" valor={describirLugar(borrador)} />
        <BotonPrincipal
          titulo="Marcar ubicación"
          variante="secundario"
          alPresionar={() => router.push('/reporte/ubicacion')}
        />
      </View>

      {errores.length > 0 ? (
        <View style={estilos.errores} accessibilityLiveRegion="polite">
          {errores.map((error) => (
            <Text key={error} style={estilos.textoError}>
              • {error}
            </Text>
          ))}
        </View>
      ) : null}

      <BotonPrincipal titulo="Guardar reporte" alPresionar={guardar} />
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  seccion: {
    gap: tema.espaciado.s,
  },
  subtitulo: {
    fontSize: tema.texto.subtitulo,
    fontWeight: '600',
    color: tema.colores.texto,
  },
  miniatura: {
    width: '100%',
    height: 160,
    borderRadius: tema.radio.m,
  },
  errores: {
    gap: tema.espaciado.xs,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    borderWidth: 1,
    borderColor: tema.colores.peligro,
  },
  textoError: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.peligro,
  },
});
