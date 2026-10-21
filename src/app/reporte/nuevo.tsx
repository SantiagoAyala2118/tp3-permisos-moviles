import PantallaEnConstruccion from '@/components/PantallaEnConstruccion';

/** `/reporte/nuevo` — Formulario del reporte. No pide ningún permiso al abrir. */
export default function PantallaNuevoReporte() {
  return <PantallaEnConstruccion titulo="Nuevo reporte" detalle="Título, descripción, aula y categoría." />;
}
