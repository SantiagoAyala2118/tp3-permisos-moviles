import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import SelectorOpciones from '@/components/SelectorOpciones';
import Tarjeta from '@/components/Tarjeta';
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
      <Tarjeta variante="destacado" estilo={estilos.heroe}>
        <View style={estilos.icono}>
          <Ionicons name="location" size={32} color={tema.colores.sobrePrimario} />
        </View>
        <Text style={estilos.etiqueta}>Lugar marcado</Text>
        <Text style={estilos.lugar}>{describirLugar(borrador)}</Text>

        {borrador.ubicacion?.aproximada ? (
          <Text style={estilos.nota}>
            Compartiste tu ubicación aproximada: guardamos la zona, sin coordenadas exactas.
          </Text>
        ) : null}

        <View style={estilos.boton}>
          <BotonPrincipal
            titulo="Usar mi ubicación actual"
            icono="navigate-outline"
            deshabilitado={buscando}
            alPresionar={usarUbicacionActual}
          />
        </View>
        {buscando ? (
          <View style={estilos.buscando}>
            <ActivityIndicator color={tema.colores.primario} />
            <Text style={estilos.nota}>Buscando tu ubicación…</Text>
          </View>
        ) : null}
      </Tarjeta>

      {ubicacionDenegada ? (
        <Text style={estilos.aviso}>Sin ubicación: elegí el sector a mano. El reporte se guarda igual.</Text>
      ) : null}
      {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}

      <Tarjeta>
        <SelectorOpciones
          etiqueta="O elegí el sector a mano"
          opciones={etiquetasReportes.sectores}
          seleccionada={borrador.sector}
          alElegir={(sector) => actualizarBorrador({ sector, ubicacion: null })}
        />
      </Tarjeta>

      <BotonPrincipal
        titulo="Listo"
        icono="checkmark"
        variante="secundario"
        alPresionar={() => router.back()}
      />
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  heroe: {
    alignItems: 'center',
    gap: tema.espaciado.s,
    paddingVertical: tema.espaciado.l,
  },
  icono: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primario,
    marginBottom: tema.espaciado.s,
  },
  etiqueta: {
    fontSize: tema.texto.chico,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: tema.colores.textoSuave,
  },
  lugar: {
    fontSize: tema.texto.titulo,
    fontWeight: '800',
    textAlign: 'center',
    color: tema.colores.texto,
  },
  boton: {
    alignSelf: 'stretch',
    marginTop: tema.espaciado.s,
  },
  nota: {
    fontSize: tema.texto.chico,
    textAlign: 'center',
    color: tema.colores.textoSuave,
  },
  aviso: {
    fontSize: tema.texto.cuerpo,
    textAlign: 'center',
    color: tema.colores.alerta,
  },
  buscando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.s,
  },
});
