import { useLocalSearchParams } from 'expo-router';

import PantallaEnConstruccion from '@/components/PantallaEnConstruccion';

/** `/reporte/[id]` — Detalle del reporte (la validación del id llega en TASK 5). */
export default function PantallaDetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PantallaEnConstruccion titulo="Detalle del reporte" detalle={`Reporte: ${id}`} />;
}
