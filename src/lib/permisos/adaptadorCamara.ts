import { Camera } from 'expo-camera';

import type { AdaptadorPermiso } from './tipos';

/**
 * Permiso de cámara del sistema. Es el mismo permiso que usa
 * `ImagePicker.launchCameraAsync`, así que sirve para el escáner y para sacar la foto.
 */
const adaptadorCamara: AdaptadorPermiso = {
  seSolicita: true,
  consultar: () => Camera.getCameraPermissionsAsync(),
  pedir: () => Camera.requestCameraPermissionsAsync(),
};

export default adaptadorCamara;
