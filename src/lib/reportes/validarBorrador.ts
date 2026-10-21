import type { Borrador } from './tipos';

/**
 * Devuelve la lista de problemas del borrador (vacía = se puede guardar).
 * Foto, ubicación y sector son opcionales: ningún permiso impide crear un reporte (RF-7).
 */
export default function validarBorrador(borrador: Borrador): string[] {
  const errores: string[] = [];

  if (!borrador.titulo.trim()) errores.push('Escribí un título.');
  if (!borrador.aula.trim()) errores.push('Indicá el aula (escaneando el QR o escribiéndola).');
  if (!borrador.categoria) errores.push('Elegí una categoría.');

  return errores;
}
