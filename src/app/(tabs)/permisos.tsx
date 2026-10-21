import { router } from 'expo-router';
import { Platform, StyleSheet, Text } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import TarjetaPermiso from '@/components/TarjetaPermiso';
import usePermiso from '@/hooks/usePermiso';
import describirEstadoPermiso from '@/lib/permisos/describirEstadoPermiso';
import describirMatices from '@/lib/permisos/describirMatices';
import textosPermisos from '@/lib/permisos/textosPermisos';
import type { Recurso, ResultadoPermiso } from '@/lib/permisos/tipos';
import tema from '@/lib/tema';

const RECURSOS: Recurso[] = ['camara', 'ubicacion', 'notificaciones', 'galeria'];

const NOTAS: Partial<Record<Recurso, string>> = {
  notificaciones: 'Se pide solo desde el interruptor de “Ajustes de la app”.',
  galeria: 'La app no lo pide: para elegir fotos usa el selector del sistema.',
};

/**
 * `/permisos` — Panel con el estado de cada permiso (RF-9, tab "Permisos").
 * Cada tarjeta usa `usePermiso`, así que se actualiza sola al volver de Ajustes (RF-1).
 */
export default function PantallaPermisos() {
  return (
    <ContenedorPantalla>
      <Text style={estilos.texto}>
        Así está cada permiso en este dispositivo. Si cambiás algo en Ajustes, al volver se
        actualiza solo.
      </Text>
      {RECURSOS.map((recurso) => (
        <TarjetaPermisoDeRecurso key={recurso} recurso={recurso} />
      ))}
    </ContenedorPantalla>
  );
}

/** Conecta un recurso con su tarjeta: consulta el permiso y elige el botón que corresponde. */
function TarjetaPermisoDeRecurso({ recurso }: { recurso: Recurso }) {
  const permiso = usePermiso(recurso);
  const textos = textosPermisos[recurso];

  const estado = permiso.seSolicita
    ? describirEstadoPermiso(permiso.estado, permiso.parcial)
    : { texto: 'No se pide', color: tema.colores.textoSuave };

  return (
    <TarjetaPermiso
      icono={textos.icono}
      nombre={textos.nombre}
      estado={estado}
      plataforma={Platform.OS}
      matices={describirMatices(permiso.respuesta)}
      nota={NOTAS[recurso]}
      accion={elegirAccion(recurso, permiso)}
    />
  );
}

/** "Continuar" (pantalla previa), "Abrir Ajustes" o ninguna acción, según el recurso y su estado. */
function elegirAccion(recurso: Recurso, permiso: ResultadoPermiso) {
  const { estado, seSolicita, abrirAjustes } = permiso;
  if (!seSolicita || estado === 'concedido' || estado === 'cargando') return undefined;

  // RF-5: las notificaciones se piden únicamente desde el interruptor de /ajustes-app.
  if (recurso === 'notificaciones') {
    return { texto: 'Ir a Ajustes de la app', alPresionar: () => router.push('/ajustes-app') };
  }

  if (estado === 'bloqueado') {
    return { texto: 'Abrir Ajustes', alPresionar: abrirAjustes };
  }

  return {
    texto: 'Continuar',
    alPresionar: () => router.push({ pathname: '/permisos/[recurso]', params: { recurso } }),
  };
}

const estilos = StyleSheet.create({
  texto: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
});
