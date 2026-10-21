import { StyleSheet, Switch, Text, View } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import useNavegarConPermiso from '@/hooks/useNavegarConPermiso';
import useReportes from '@/hooks/useReportes';
import tema from '@/lib/tema';

/**
 * `/ajustes-app` — Interruptor "Avisarme cuando se resuelva mi reporte" (RF-5).
 * Es el ÚNICO lugar de la app que pide el permiso de notificaciones, y solo al activar el interruptor.
 */
export default function PantallaAjustesApp() {
  const { preferenciaAvisos, cambiarPreferenciaAvisos } = useReportes();
  const notificaciones = useNavegarConPermiso('notificaciones');

  const concedido = notificaciones.estado === 'concedido';
  // El interruptor se ve prendido solo si la persona lo quiere Y el sistema lo permite.
  const activo = preferenciaAvisos && concedido;

  const alCambiar = (quiereAvisos: boolean) => {
    cambiarPreferenciaAvisos(quiereAvisos);
    // Al activarlo sin permiso: pantalla previa → "Continuar" → diálogo del sistema.
    if (quiereAvisos) notificaciones.irConPermiso();
  };

  return (
    <ContenedorPantalla>
      <View style={estilos.fila}>
        <View style={estilos.textos}>
          <Text style={estilos.titulo}>Avisarme cuando se resuelva mi reporte</Text>
          <Text style={estilos.detalle}>Te mandamos una notificación cuando se arregla el desperfecto.</Text>
        </View>
        <Switch
          accessibilityLabel="Avisarme cuando se resuelva mi reporte"
          value={activo}
          onValueChange={alCambiar}
          trackColor={{ true: tema.colores.primario, false: tema.colores.borde }}
        />
      </View>

      {preferenciaAvisos && !concedido && notificaciones.estado !== 'cargando' ? (
        <Text style={estilos.aviso}>
          Las notificaciones no están permitidas. No pasa nada: te avisamos en la pestaña “Avisos”.
        </Text>
      ) : null}

      {!preferenciaAvisos ? (
        <Text style={estilos.detalle}>
          Con el interruptor apagado, los avisos de tus reportes aparecen en la pestaña “Avisos”.
        </Text>
      ) : null}
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espaciado.m,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
  },
  textos: {
    flex: 1,
    gap: tema.espaciado.xs,
  },
  titulo: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '600',
    color: tema.colores.texto,
  },
  detalle: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  aviso: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.alerta,
  },
});
