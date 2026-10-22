import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import TarjetaReporte from '@/components/TarjetaReporte';
import TarjetaResumen from '@/components/TarjetaResumen';
import useReportes from '@/hooks/useReportes';
import contarPorEstado from '@/lib/reportes/contarPorEstado';
import tema from '@/lib/tema';

/** `/` — Inicio (tab "Reportes"): lista de reportes propios con su estado. No pide permisos. */
export default function PantallaInicio() {
  const { reportes } = useReportes();

  return (
    <ContenedorPantalla conBarraTabs>
      <TarjetaResumen
        conteo={contarPorEstado(reportes)}
        alCrearReporte={() => router.push('/reporte/nuevo')}
        alVerPermisos={() => router.push('/permisos')}
      />

      <View style={estilos.encabezadoLista}>
        <Text style={estilos.titulo}>Mis reportes</Text>
        <Text style={estilos.cantidad}>{reportes.length}</Text>
      </View>

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
  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: tema.espaciado.s,
  },
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '800',
    color: tema.colores.texto,
  },
  cantidad: {
    minWidth: 32,
    paddingHorizontal: tema.espaciado.s,
    paddingVertical: 2,
    borderRadius: tema.radio.pildora,
    textAlign: 'center',
    overflow: 'hidden',
    fontWeight: '700',
    color: tema.colores.sobrePrimario,
    backgroundColor: tema.colores.primario,
  },
  vacio: {
    fontSize: tema.texto.cuerpo,
    color: tema.colores.textoSuave,
  },
});
