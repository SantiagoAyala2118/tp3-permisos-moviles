import PantallaEnConstruccion from '@/components/PantallaEnConstruccion';

/** `/reporte/foto` — Sacar foto (cámara) o elegirla con el selector del sistema (sin permiso). */
export default function PantallaFoto() {
  return <PantallaEnConstruccion titulo="Foto del desperfecto" detalle="Sacá una foto o elegila de la galería." />;
}
