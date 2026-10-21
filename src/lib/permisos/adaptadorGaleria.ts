import * as ImagePicker from 'expo-image-picker';

import type { AdaptadorPermiso } from './tipos';

/**
 * La galería NUNCA se pide: para elegir una foto la app usa el selector del sistema
 * (`launchImageLibraryAsync`), que no necesita permiso. Solo se consulta para
 * mostrar el estado y el matiz (`accessPrivileges`) en el panel de permisos.
 */
const consultarGaleria = () => ImagePicker.getMediaLibraryPermissionsAsync();

const adaptadorGaleria: AdaptadorPermiso = {
  seSolicita: false,
  consultar: consultarGaleria,
  pedir: consultarGaleria,
};

export default adaptadorGaleria;
