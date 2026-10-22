import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import etiquetasReportes from '@/lib/reportes/etiquetasReportes';
import type { EstadoReporte } from '@/lib/reportes/tipos';
import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';
import Tarjeta from './Tarjeta';

const ESTADOS: EstadoReporte[] = ['pendiente', 'en_curso', 'resuelto'];

type Props = {
  conteo: Record<EstadoReporte, number>;
  alCrearReporte: () => void;
  alVerPermisos: () => void;
};

/** Tarjeta principal de Inicio: identidad de la app, resumen por estado y acciones. */
export default function TarjetaResumen({ conteo, alCrearReporte, alVerPermisos }: Props) {
  return (
    <Tarjeta variante="destacado" estilo={estilos.tarjeta}>
      <View style={estilos.anillo}>
        <View style={estilos.avatar}>
          <Ionicons name="construct" size={38} color={tema.colores.sobrePrimario} />
        </View>
      </View>

      <View style={estilos.identidad}>
        <View style={estilos.fila}>
          <Text style={estilos.nombre}>Mantenimiento IPF</Text>
          <Ionicons name="checkmark-circle" size={18} color={tema.colores.primario} />
        </View>
        <Text style={estilos.lema}>Reportá · Seguí · Resolvé</Text>
      </View>

      <View style={estilos.estadisticas}>
        {ESTADOS.map((estado) => (
          <View key={estado} style={estilos.estadistica}>
            <Text style={estilos.numero}>{conteo[estado]}</Text>
            <Text style={estilos.etiqueta}>{etiquetasReportes.estados[estado]}</Text>
          </View>
        ))}
      </View>

      <View style={estilos.acciones}>
        <View style={estilos.accion}>
          <BotonPrincipal titulo="Reportar" icono="add-circle" alPresionar={alCrearReporte} />
        </View>
        <View style={estilos.accion}>
          <BotonPrincipal
            titulo="Permisos"
            icono="shield-checkmark-outline"
            variante="secundario"
            alPresionar={alVerPermisos}
          />
        </View>
      </View>
    </Tarjeta>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    alignItems: 'center',
    gap: tema.espaciado.m,
    paddingVertical: tema.espaciado.l,
  },
  anillo: {
    padding: 5,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: tema.colores.primario,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primario,
  },
  identidad: {
    alignItems: 'center',
    gap: 2,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nombre: {
    fontSize: tema.texto.titulo,
    fontWeight: '800',
    color: tema.colores.texto,
  },
  lema: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  estadisticas: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: tema.espaciado.s,
  },
  estadistica: {
    alignItems: 'center',
    gap: 2,
  },
  numero: {
    fontSize: tema.texto.gigante,
    fontWeight: '800',
    color: tema.colores.texto,
  },
  etiqueta: {
    fontSize: tema.texto.chico,
    color: tema.colores.textoSuave,
  },
  acciones: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: tema.espaciado.s,
  },
  accion: {
    flex: 1,
  },
});
