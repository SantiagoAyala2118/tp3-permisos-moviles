import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import PantallaPrevia from '@/components/PantallaPrevia';
import VistaCargando from '@/components/VistaCargando';
import usePermiso from '@/hooks/usePermiso';
import esRecursoSolicitable from '@/lib/permisos/esRecursoSolicitable';
import obtenerPasosAjustes from '@/lib/permisos/obtenerPasosAjustes';
import textosPermisos, { ACLARACION_AJUSTES } from '@/lib/permisos/textosPermisos';
import type { RecursoSolicitable } from '@/lib/permisos/tipos';
import tema from '@/lib/tema';

/** Solo se aceptan rutas internas de la app como destino. */
const esDestinoValido = (destino: unknown): destino is string =>
  typeof destino === 'string' && destino.startsWith('/') && !destino.startsWith('//');

/**
 * `/permisos/[recurso]` — Pantalla previa al diálogo del sistema (modal).
 * Valida el recurso de la URL y delega el contenido según el estado del permiso.
 */
export default function PantallaAntesDePedir() {
  const { recurso, destino } = useLocalSearchParams<{ recurso: string; destino?: string }>();

  if (!esRecursoSolicitable(recurso)) {
    return (
      <ContenedorPantalla>
        <Text style={estilos.titulo}>Recurso desconocido</Text>
        <Text style={estilos.texto}>“{String(recurso ?? '')}” no es un permiso que use la app.</Text>
        <BotonPrincipal titulo="Volver" alPresionar={() => router.back()} />
      </ContenedorPantalla>
    );
  }

  return (
    <ContenidoPantallaPrevia
      recurso={recurso}
      destino={esDestinoValido(destino) ? (destino as Href) : undefined}
    />
  );
}

type PropsContenido = {
  recurso: RecursoSolicitable;
  destino?: Href;
};

/** Decide qué mostrar según el estado: "Continuar" (preguntable) o "Abrir Ajustes" (bloqueado). */
function ContenidoPantallaPrevia({ recurso, destino }: PropsContenido) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const textos = textosPermisos[recurso];

  /**
   * Cierra el modal y sigue a la función que se quería usar (si hay `destino`).
   * Se va al destino AUNQUE se haya denegado: esa pantalla muestra su alternativa
   * (ej.: el escáner ofrece escribir el código a mano) y nunca vuelve a pedir sola (RF-7, RF-8).
   */
  const volver = () => {
    router.back();
    if (destino) router.push(destino);
  };

  if (estado === 'cargando') return <VistaCargando />;

  if (estado === 'concedido') {
    return (
      <ContenedorPantalla>
        <PantallaPrevia
          icono={textos.icono}
          titulo="¡Listo!"
          mensaje={`El permiso de ${textos.nombre.toLowerCase()} ya está habilitado.`}
          textoBoton="Continuar"
          alPresionar={volver}
        />
      </ContenedorPantalla>
    );
  }

  if (estado === 'bloqueado') {
    // El diálogo del sistema ya no va a aparecer: solo se puede habilitar desde Ajustes.
    return (
      <ContenedorPantalla>
        <PantallaPrevia
          icono={textos.icono}
          titulo={`${textos.nombre} desactivada`}
          mensaje={`${textos.beneficio} Para usarla, habilitala desde Ajustes:`}
          pasosAjustes={obtenerPasosAjustes(textos)}
          aclaracion="Cuando vuelvas, la app se actualiza sola."
          textoBoton="Abrir Ajustes"
          alPresionar={abrirAjustes}
        />
      </ContenedorPantalla>
    );
  }

  // Preguntable: el diálogo del sistema aparece recién al tocar "Continuar".
  const continuar = async () => {
    await pedir();
    volver();
  };

  return (
    <ContenedorPantalla>
      <PantallaPrevia
        icono={textos.icono}
        titulo={textos.titulo}
        mensaje={textos.beneficio}
        aclaracion={ACLARACION_AJUSTES}
        textoBoton="Continuar"
        alPresionar={continuar}
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
});
