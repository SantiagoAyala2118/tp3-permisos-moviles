import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import Tarjeta from '@/components/Tarjeta';
import TarjetaAviso from '@/components/TarjetaAviso';
import useReportes from '@/hooks/useReportes';
import tema from '@/lib/tema';

/**
 * `/avisos` — Bandeja de avisos dentro de la app (tab "Avisos").
 * Es la alternativa a las notificaciones: si están denegadas, los avisos llegan acá.
 */
export default function PantallaAvisos() {
  const { avisos } = useReportes();

  if (avisos.length === 0) {
    return (
      <ContenedorPantalla conBarraTabs>
        <Tarjeta variante="destacado" estilo={estilos.vacio}>
          <View style={estilos.icono}>
            <Ionicons name="notifications-outline" size={36} color={tema.colores.sobrePrimario} />
          </View>
          <Text style={estilos.titulo}>No tenés avisos</Text>
          <Text style={estilos.texto}>
            Cuando se resuelva un reporte y no tengas las notificaciones activadas, el aviso va a
            aparecer acá.
          </Text>
        </Tarjeta>
      </ContenedorPantalla>
    );
  }

  return (
    <ContenedorPantalla conBarraTabs>
      {avisos.map((aviso) => (
        <TarjetaAviso
          key={aviso.id}
          aviso={aviso}
          alPresionar={() =>
            router.push({ pathname: '/reporte/[id]', params: { id: aviso.reporteId } })
          }
        />
      ))}
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  vacio: {
    alignItems: 'center',
    gap: tema.espaciado.m,
    paddingVertical: tema.espaciado.xl,
  },
  icono: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primario,
  },
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  texto: {
    fontSize: tema.texto.cuerpo,
    lineHeight: 22,
    textAlign: 'center',
    color: tema.colores.textoSuave,
  },
});
