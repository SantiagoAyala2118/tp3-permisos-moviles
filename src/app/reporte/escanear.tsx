import PantallaEnConstruccion from '@/components/PantallaEnConstruccion';

/** `/reporte/escanear` — Lee el QR del aula (cámara, cuatro estados). */
export default function PantallaEscanear() {
  return <PantallaEnConstruccion titulo="Escanear QR del aula" detalle="Lee el código pegado en la puerta del aula." />;
}
