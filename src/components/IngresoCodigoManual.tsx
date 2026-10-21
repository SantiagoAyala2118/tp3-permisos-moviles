import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import tema from '@/lib/tema';

import BotonPrincipal from './BotonPrincipal';
import CampoTexto from './CampoTexto';

type Props = {
  valorInicial?: string;
  alConfirmar: (codigo: string) => void;
};

/** Alternativa a la cámara: escribir a mano el código del aula (RF-2 / RF-7). */
export default function IngresoCodigoManual({ valorInicial = '', alConfirmar }: Props) {
  const [codigo, setCodigo] = useState(valorInicial);
  const codigoLimpio = codigo.trim();

  const confirmar = () => {
    if (codigoLimpio) alConfirmar(codigoLimpio);
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>¿Sin cámara? Escribí el código del aula</Text>
      <CampoTexto
        etiqueta="Código del aula"
        valor={codigo}
        alCambiar={setCodigo}
        marcador="Ej.: AULA-12 (está debajo del QR)"
        alEnviar={confirmar}
      />
      <BotonPrincipal
        titulo="Usar este código"
        variante="secundario"
        deshabilitado={!codigoLimpio}
        alPresionar={confirmar}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: tema.espaciado.s,
  },
  titulo: {
    fontSize: tema.texto.cuerpo,
    fontWeight: '600',
    color: tema.colores.texto,
  },
});
