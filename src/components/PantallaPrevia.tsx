import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';

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
      <View style={estilos.circuloIcono}>
        <Ionicons name={icono} size={40} color={tema.colores.primario} />
      </View>
      <Text style={estilos.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      <Text style={estilos.mensaje}>{mensaje}</Text>
      {pasosAjustes ? <Text style={estilos.pasos}>{pasosAjustes}</Text> : null}

      <BotonPrincipal titulo={textoBoton} alPresionar={alPresionar} />
      {aclaracion ? <Text style={estilos.aclaracion}>{aclaracion}</Text> : null}

      {children ? <View style={estilos.alternativa}>{children}</View> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: tema.espaciado.m,
    paddingVertical: tema.espaciado.l,
  },
  circuloIcono: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tema.colores.primarioSuave,
  },
  titulo: {
    fontSize: tema.texto.titulo,
    fontWeight: '700',
    textAlign: 'center',
    color: tema.colores.texto,
  },
  mensaje: {
    fontSize: tema.texto.cuerpo,
    textAlign: 'center',
    color: tema.colores.texto,
  },
  pasos: {
    fontSize: tema.texto.cuerpo,
    padding: tema.espaciado.m,
    borderRadius: tema.radio.m,
    backgroundColor: tema.colores.superficie,
    borderWidth: 1,
    borderColor: tema.colores.borde,
    color: tema.colores.texto,
  },
  aclaracion: {
    fontSize: tema.texto.chico,
    textAlign: 'center',
    color: tema.colores.textoSuave,
  },
  alternativa: {
    gap: tema.espaciado.s,
    paddingTop: tema.espaciado.m,
    borderTopWidth: 1,
    borderTopColor: tema.colores.borde,
  },
});
