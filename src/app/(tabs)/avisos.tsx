import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
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
      <ContenedorPantalla>
        <Text style={estilos.titulo}>No tenés avisos</Text>
        <Text style={estilos.texto}>
          Cuando se resuelva un reporte y no tengas las notificaciones activadas, el aviso va a
          aparecer acá.
        </Text>
      </ContenedorPantalla>
    );
  }

  return (
    <ContenedorPantalla>
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
