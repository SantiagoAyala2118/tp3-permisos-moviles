import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import FilaDato from '@/components/FilaDato';
import SelectorOpciones from '@/components/SelectorOpciones';
import useNavegarConPermiso from '@/hooks/useNavegarConPermiso';
import useReportes from '@/hooks/useReportes';
import describirLugar from '@/lib/reportes/describirLugar';
import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import tema from '@/lib/tema';
import obtenerUbicacion from '@/lib/ubicacion/obtenerUbicacion';

/**
 * `/reporte/ubicacion` — Marca dónde está el problema (RF-4).
 * - Pide SOLO ubicación en primer plano, y recién al tocar el botón.
 * - Aproximada: muestra "Ubicación aproximada", sin coordenadas exactas.
 * - Denegada: el reporte se carga con el sector elegido a mano.
 */
export default function PantallaUbicacion() {
  const { borrador, actualizarBorrador } = useReportes();
  const ubicacion = useNavegarConPermiso('ubicacion');
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const usarUbicacionActual = async () => {
    setAviso(null);
    // Sin permiso: abre la pantalla previa y la persona vuelve a tocar el botón.
    if (!ubicacion.irConPermiso()) return;

    setBuscando(true);
    const resultado = await obtenerUbicacion();
    setBuscando(false);

    if (resultado) {
      actualizarBorrador({ ubicacion: resultado, sector: null });
    } else {
      setAviso('No pudimos obtener tu ubicación (¿GPS apagado?). Elegí el sector a mano.');
    }
  };

  const ubicacionDenegada = ubicacion.respuesta?.status === 'denied';

  return (
    <ContenedorPantalla>
      <FilaDato etiqueta="Lugar marcado" valor={describirLugar(borrador)} />

      {borrador.ubicacion?.aproximada ? (
        <Text style={estilos.nota}>
          Compartiste tu ubicación aproximada: guardamos la zona, sin coordenadas exactas.
        </Text>
      ) : null}

      <BotonPrincipal
        titulo="Usar mi ubicación actual"
        deshabilitado={buscando}
        alPresionar={usarUbicacionActual}
      />
      {buscando ? (
        <View style={estilos.buscando}>
          <ActivityIndicator color={tema.colores.primario} />
          <Text style={estilos.nota}>Buscando tu ubicación…</Text>
        </View>
      ) : null}

      {ubicacionDenegada ? (
        <Text style={estilos.aviso}>Sin ubicación: elegí el sector a mano. El reporte se guarda igual.</Text>
      ) : null}
      {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}

      <SelectorOpciones
        etiqueta="O elegí el sector a mano"
        opciones={etiquetasReportes.sectores}
        seleccionada={borrador.sector}
        alElegir={(sector) => actualizarBorrador({ sector, ubicacion: null })}
      />

      <BotonPrincipal titulo="Listo" variante="secundario" alPresionar={() => router.back()} />
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  nota: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  aviso: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.alerta,
  },
  buscando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.s,
  },
});
