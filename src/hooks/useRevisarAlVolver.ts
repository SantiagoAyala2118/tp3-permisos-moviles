import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Llama a `revisar()` cada vez que la app vuelve al frente (por ejemplo, al volver de Ajustes).
 * Los hooks de Expo no se enteran solos de que el permiso cambió afuera de la app.
 */
export default function useRevisarAlVolver(revisar: () => unknown) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current !== 'active';
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });
    return () => suscripcion.remove();
  }, [revisar]);
}
