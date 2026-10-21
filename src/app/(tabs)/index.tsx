import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import BotonPrincipal from '@/components/BotonPrincipal';
import ContenedorPantalla from '@/components/ContenedorPantalla';
import TarjetaReporte from '@/components/TarjetaReporte';
import useReportes from '@/hooks/useReportes';
import tema from '@/lib/tema';

/** `/` — Inicio (tab "Reportes"): lista de reportes propios con su estado. No pide permisos. */
export default function PantallaInicio() {
  const { reportes } = useReportes();

  return (
    <ContenedorPantalla>
      <BotonPrincipal titulo="Nuevo reporte" alPresionar={() => router.push('/reporte/nuevo')} />

      <Text style={estilos.titulo}>Mis reportes</Text>

      {reportes.length === 0 ? (
        <Text style={estilos.vacio}>Todavía no reportaste ningún desperfecto.</Text>
      ) : (
        reportes.map((reporte) => (
          <TarjetaReporte
            key={reporte.id}
            reporte={reporte}
            alPresionar={() =>
              router.push({ pathname: '/reporte/[id]', params: { id: reporte.id } })
            }
          />
        ))
      )}
    </ContenedorPantalla>
  );
}

const estilos = StyleSheet.create({
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '700',
    color: tema.colores.texto,
  },
  vacio: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
});
