import { useLocalSearchParams } from 'expo-router';

import PantallaEnConstruccion from '@/components/PantallaEnConstruccion';

/** `/permisos/[recurso]` — Pantalla previa al diálogo del sistema (modal, TASK 6). */
export default function PantallaPrevia() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  return <PantallaEnConstruccion titulo="Antes de continuar" detalle={`Recurso: ${recurso}`} />;
}
