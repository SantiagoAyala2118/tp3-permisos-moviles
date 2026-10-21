import * as ImagePicker from 'expo-image-picker';

/**
 * Abre el SELECTOR DEL SISTEMA para elegir una foto (RF-3).
 * No pide ningún permiso: el selector corre fuera de la app, la persona elige
 * y la app recibe solo esa imagen. Por eso la app no declara READ_MEDIA_IMAGES.
 * Devuelve la `uri` de la foto o `null` si la persona canceló.
 */
export default async function elegirFotoDeGaleria(): Promise<string | null> {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });

  if (resultado.canceled) return null;
  return resultado.assets[0]?.uri ?? null;
}
