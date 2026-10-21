import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

import clasificarRespuesta from '@/lib/permisos/clasificarRespuesta';
import esAccesoParcial from '@/lib/permisos/esAccesoParcial';
import registroAdaptadores from '@/lib/permisos/registroAdaptadores';
import type { RespuestaPermiso, Recurso, ResultadoPermiso } from '@/lib/permisos/tipos';

import useRevisarAlVolver from './useRevisarAlVolver';

const abrirAjustes = () => Linking.openSettings();

/**
 * Hook unificado de permisos (RF-1).
 * - Solo CONSULTA al montarse y al volver a la pantalla: nunca pide solo (RF-8).
 * - Se actualiza al volver de Ajustes gracias a `AppState`.
 * - `pedir()` es lo único que puede mostrar el diálogo, y se llama desde un botón.
 */
export default function usePermiso(recurso: Recurso): ResultadoPermiso {
  const adaptador = registroAdaptadores[recurso];
  const [respuesta, setRespuesta] = useState<RespuestaPermiso | null>(null);

  const consultar = useCallback(async () => {
    const nueva = await adaptador.consultar();
    setRespuesta(nueva);
    return nueva;
  }, [adaptador]);

  const pedir = useCallback(async () => {
    const nueva = await adaptador.pedir();
    setRespuesta(nueva);
    return nueva;
  }, [adaptador]);

  // Al montar y cada vez que la pantalla vuelve a estar enfocada
  // (por ejemplo, al cerrar el modal de la pantalla previa).
  useFocusEffect(
    useCallback(() => {
      consultar();
    }, [consultar]),
  );

  // Al volver de Ajustes (la app pasa de segundo plano a activa).
  useRevisarAlVolver(consultar);

  return {
    estado: clasificarRespuesta(respuesta),
    parcial: esAccesoParcial(respuesta),
    respuesta,
    seSolicita: adaptador.seSolicita,
    pedir,
    consultar,
    abrirAjustes,
  };
}
