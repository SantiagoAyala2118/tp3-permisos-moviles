import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import useNavegarConPermiso from '@/hooks/useNavegarConPermiso';
import useReportes from '@/hooks/useReportes';
import elegirFotoDeGaleria from '@/lib/fotos/elegirFotoDeGaleria';
import sacarFotoConCamara from '@/lib/fotos/sacarFotoConCamara';
import tema from '@/lib/tema';

/**
 * `/reporte/foto` — Adjuntar foto del desperfecto (RF-3).
 * - "Sacar foto": usa la cámara → se pide permiso (con pantalla previa).
 * - "Elegir de la galería": selector del sistema → NO se pide ningún permiso.
 */
export default function PantallaFoto() {
  const { borrador, actualizarBorrador } = useReportes();
  const camara = useNavegarConPermiso('camara');
  const [aviso, setAviso] = useState<string | null>(null);

  const guardarFoto = (uri: string | null) => {
    if (uri) actualizarBorrador({ fotoUri: uri });
  };

  const sacarFoto = async () => {
    setAviso(null);
    // Sin permiso: abre la pantalla previa y la persona vuelve a tocar "Sacar foto".
    if (!camara.irConPermiso()) return;

    try {
      guardarFoto(await sacarFotoConCamara());
    } catch {
      setAviso('No pudimos abrir la cámara. Podés elegir la foto desde la galería.');
    }
  };

  const elegirDeGaleria = async () => {
    setAviso(null);
    guardarFoto(await elegirFotoDeGaleria());
  };

  const camaraDenegada = camara.respuesta?.status === 'denied';

  return (
    <ContenedorPantalla>
      {borrador.fotoUri ? (
        <Image
          source={{ uri: borrador.fotoUri }}
          style={estilos.foto}
          contentFit="cover"
          accessibilityLabel="Foto adjunta al reporte"
        />
      ) : (
        <View style={estilos.sinFoto}>
          <Text style={estilos.textoSuave}>Todavía no adjuntaste ninguna foto.</Text>
        </View>
      )}

      <BotonPrincipal titulo="Sacar foto" alPresionar={sacarFoto} />
      <BotonPrincipal titulo="Elegir de la galería" variante="secundario" alPresionar={elegirDeGaleria} />

      <Text style={estilos.textoSuave}>
        Para elegir una foto no hace falta ningún permiso: usamos el selector del sistema y solo
        recibimos la imagen que elegís.
      </Text>

      {camaraDenegada ? (
        <Text style={estilos.aviso}>
          La cámara no está permitida, pero podés adjuntar la foto desde la galería.
        </Text>
      ) : null}
      {aviso ? <Text style={estilos.aviso}>{aviso}</Text> : null}

      {borrador.fotoUri ? (
        <View style={estilos.acciones}>
          <BotonPrincipal titulo="Listo" alPresionar={() => router.back()} />
          <BotonPrincipal
            titulo="Quitar foto"
            variante="secundario"
            alPresionar={() => actualizarBorrador({ fotoUri: null })}
          />
        </View>
      ) : null}
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  foto: {
    width: '100%',
    height: 260,
    borderRadius: tema.radio.m,
  },
  sinFoto: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tema.radio.m,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tema.colores.borde,
  },
  textoSuave: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  aviso: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.alerta,
  },
  acciones: {
    gap: tema.espaciado.s,
  },
});
