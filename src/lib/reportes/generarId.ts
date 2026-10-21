/** Id corto y único para reportes y avisos (alcanza para datos en memoria). */
export default function generarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
