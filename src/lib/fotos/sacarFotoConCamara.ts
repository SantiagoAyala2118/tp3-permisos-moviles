import * as ImagePicker from 'expo-image-picker';

/**
 * Abre la cámara para sacar la foto en el momento. Requiere el permiso de cámara,
 * que la pantalla pide antes con la pantalla previa.
 * Devuelve la `uri`, `null` si la persona canceló, o lanza un error si la cámara no se pudo abrir.
 * Por ejemplo, en Android 9 o anterior el módulo también exige WRITE_EXTERNAL_STORAGE,
 * que la app bloquea por mínimo privilegio.
 */
export default async function sacarFotoConCamara(): Promise<string | null> {
  const resultado = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });

  if (resultado.canceled) return null;
  return resultado.assets[0]?.uri ?? null;
}
