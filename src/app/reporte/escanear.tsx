import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';

import ContenedorPantalla from '@/components/ContenedorPantalla';
import IngresoCodigoManual from '@/components/IngresoCodigoManual';
import PantallaPrevia from '@/components/PantallaPrevia';
import VistaCargando from '@/components/VistaCargando';
import useReportes from '@/hooks/useReportes';
import useRevisarAlVolver from '@/hooks/useRevisarAlVolver';
import clasificarRespuesta from '@/lib/permisos/clasificarRespuesta';
import obtenerPasosAjustes from '@/lib/permisos/obtenerPasosAjustes';
import textosPermisos, { ACLARACION_AJUSTES } from '@/lib/permisos/textosPermisos';
import tema from '@/lib/tema';

const LARGO_MAXIMO_CODIGO = 40;

/**
 * `/reporte/escanear` — Lee el QR del aula y completa el campo "aula" (RF-2).
 * Usa `useCameraPermissions` (como pide la consigna) con los cuatro estados:
 * cargando → concedido → preguntable → bloqueado.
 */
export default function PantallaEscanear() {
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  useRevisarAlVolver(consultarPermiso); // se actualiza al volver de Ajustes

  const { borrador, actualizarBorrador } = useReportes();
  const yaLeyo = useRef(false);
  const textos = textosPermisos.camara;

  /** Guarda el aula en el borrador y vuelve al formulario. */
  const usarCodigo = (codigo: string) => {
    actualizarBorrador({ aula: codigo.trim().slice(0, LARGO_MAXIMO_CODIGO) });
    router.back();
  };

  /** La cámara dispara el evento varias veces por segundo: se usa solo la primera lectura. */
  const alLeerQr = ({ data }: BarcodeScanningResult) => {
    if (yaLeyo.current || !data.trim()) return;
    yaLeyo.current = true;
    usarCodigo(data);
  };

  const ingresoManual = <IngresoCodigoManual valorInicial={borrador.aula} alConfirmar={usarCodigo} />;

  switch (clasificarRespuesta(permiso)) {
    // 1. Cargando: el hook todavía está consultando (permiso === null).
    case 'cargando':
      return <VistaCargando />;

    // 2. Concedido: la cámara lee el QR.
    case 'concedido':
      // En la web, expo-camera lee QR con un archivo WASM que se descarga de un CDN externo:
      // si la red lo bloquea, falla en bucle. La app es móvil, así que en la web se escribe a mano.
      if (Platform.OS === 'web') {
        return (
          <ContenedorPantalla>
            <Text style={estilos.indicacion}>
              El escáner de QR funciona en el celular. En la versión web, escribí el código del aula.
            </Text>
            {ingresoManual}
          </ContenedorPantalla>
        );
      }

      return (
        <View style={estilos.pantalla}>
          <CameraView
            style={estilos.camara}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={alLeerQr}
          />
          <View style={estilos.panel}>
            <Text style={estilos.indicacion}>Apuntá al QR pegado en la puerta del aula.</Text>
            {ingresoManual}
          </View>
        </View>
      );

    // 3. Preguntable: explicación + "Continuar" (recién ahí aparece el diálogo del sistema).
    case 'preguntable':
      return (
        <ContenedorPantalla>
          <PantallaPrevia
            icono={textos.icono}
            titulo="Escaneá el QR del aula"
            mensaje={textos.beneficio}
            aclaracion={ACLARACION_AJUSTES}
            textoBoton="Continuar"
            alPresionar={pedirPermiso}>
            {ingresoManual}
          </PantallaPrevia>
        </ContenedorPantalla>
      );

    // 4. Bloqueado: solo se puede habilitar desde Ajustes.
    case 'bloqueado':
      return (
        <ContenedorPantalla>
          <PantallaPrevia
            icono={textos.icono}
            titulo="Cámara desactivada"
            mensaje="La cámara está desactivada para esta app. Para escanear el QR, habilitala desde Ajustes:"
            pasosAjustes={obtenerPasosAjustes(textos)}
            aclaracion="Cuando vuelvas, la app se actualiza sola."
            textoBoton="Abrir Ajustes"
            alPresionar={() => Linking.openSettings()}>
            {ingresoManual}
          </PantallaPrevia>
        </ContenedorPantalla>
      );
  }
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: tema.colores.fondo,
  },
  camara: {
    flex: 1,
  },
  panel: {
    gap: tema.espaciado.m,
    padding: tema.espaciado.m,
    backgroundColor: tema.colores.superficie,
    borderTopWidth: 1,
    borderTopColor: tema.colores.borde,
  },
  indicacion: {
    fontSize: tema.texto.cuerpo,
    textAlign: 'center',
    color: tema.colores.texto,
  },
});
