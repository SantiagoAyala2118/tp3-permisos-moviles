import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';
import Tarjeta from './Tarjeta';

type Props = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  /** El beneficio, en una frase (o la explicación de cómo habilitarlo si está bloqueado). */
  mensaje: string;
  /** Camino en Ajustes: solo cuando el permiso está bloqueado. */
  pasosAjustes?: string;
  aclaracion?: string;
  /** "Continuar" (preguntable) o "Abrir Ajustes" (bloqueado). */
  textoBoton: string;
  alPresionar: () => void;
  /** Alternativa opcional que se muestra debajo (ej.: escribir el código a mano). */
  children?: ReactNode;
};

/**
 * Pantalla previa al diálogo del sistema (RF-6). Tiene tres elementos:
 * el beneficio en una frase, UN ÚNICO botón y la aclaración de que se puede cambiar en Ajustes.
 * No tiene "Ahora no" ni "Cerrar" (pauta 5.1.1(iv) de Apple).
 */
export default function PantallaPrevia({
  icono,
  titulo,
  mensaje,
  pasosAjustes,
  aclaracion,
  textoBoton,
  alPresionar,
  children,
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <Tarjeta variante="destacado" estilo={estilos.heroe}>
        <View style={estilos.anillo}>
          <View style={estilos.circuloIcono}>
            <Ionicons name={icono} size={40} color={tema.colores.sobrePrimario} />
          </View>
        </View>
        <Text style={estilos.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        <Text style={estilos.mensaje}>{mensaje}</Text>
        {pasosAjustes ? <Text style={estilos.pasos}>{pasosAjustes}</Text> : null}

        <View style={estilos.boton}>
          <BotonPrincipal titulo={textoBoton} alPresionar={alPresionar} />
        </View>
        {aclaracion ? <Text style={estilos.aclaracion}>{aclaracion}</Text> : null}
      </Tarjeta>

      {children ? <Tarjeta estilo={estilos.alternativa}>{children}</Tarjeta> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: tema.espaciado.m,
    paddingVertical: tema.espaciado.s,
  },
  heroe: {
    alignItems: 'center',
    gap: tema.espaciado.m,
    paddingVertical: tema.espaciado.xl,
    paddingHorizontal: tema.espaciado.l,
  },
  anillo: {
    padding: 6,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: tema.colores.primario,
  },
  circuloIcono: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primario,
  },
  titulo: {
    fontSize: tema.texto.titulo + 2,
    fontWeight: '800',
    textAlign: 'center',
    color: tema.colores.texto,
  },
  mensaje: {
    fontSize: tema.texto.cuerpo,
    lineHeight: 22,
    textAlign: 'center',
    color: tema.colores.textoSuave,
  },
  pasos: {
    alignSelf: 'stretch',
    fontSize: tema.texto.cuerpo,
    lineHeight: 22,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    backgroundColor: tema.colores.fondo,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    color: tema.colores.texto,
  },
  boton: {
    alignSelf: 'stretch',
  },
  aclaracion: {
    fontSize: tema.texto.chico,
    textAlign: 'center',
    color: tema.colores.textoSuave,
  },
  alternativa: {
    gap: tema.espaciado.s,
  },
});
