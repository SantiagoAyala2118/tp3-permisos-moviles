import { createContext, useMemo, useReducer, type ReactNode } from 'react';

import estadoInicialReportes from './estadoInicialReportes';
import generarId from './generarId';
import reducerReportes from './reducerReportes';
import type { Aviso, Borrador, Categoria, EstadoReportes, Reporte } from './tipos';

/** Acciones que las pantallas pueden usar (no conocen el reducer ni sus acciones internas). */
export type AccionesReportes = {
  actualizarBorrador: (cambios: Partial<Borrador>) => void;
  limpiarBorrador: () => void;
  /** Crea el reporte a partir del borrador (ya validado), lo limpia y devuelve el id. */
  crearReporte: () => string;
  buscarReporte: (id: string) => Reporte | undefined;
  marcarResuelto: (id: string) => void;
  agregarAviso: (aviso: Omit<Aviso, 'id' | 'fecha'>) => void;
  cambiarPreferenciaAvisos: (activa: boolean) => void;
};

export type ValorContextoReportes = EstadoReportes & AccionesReportes;

export const ContextoReportes = createContext<ValorContextoReportes | null>(null);

type Props = {
  children: ReactNode;
};

/** Estado global de reportes, borrador y avisos (patrón Provider: Context + useReducer). */
export default function ReportesProveedor({ children }: Props) {
  const [estado, despachar] = useReducer(reducerReportes, estadoInicialReportes);

  const valor = useMemo<ValorContextoReportes>(
    () => ({
      ...estado,
      actualizarBorrador: (cambios) => despachar({ tipo: 'actualizarBorrador', cambios }),
      limpiarBorrador: () => despachar({ tipo: 'limpiarBorrador' }),
      crearReporte: () => {
        const { borrador } = estado;
        const reporte: Reporte = {
          ...borrador,
          id: generarId(),
          titulo: borrador.titulo.trim(),
          descripcion: borrador.descripcion.trim(),
          aula: borrador.aula.trim(),
          categoria: borrador.categoria as Categoria,
          estado: 'pendiente',
          fechaCreacion: Date.now(),
        };
        despachar({ tipo: 'crearReporte', reporte });
        despachar({ tipo: 'limpiarBorrador' });
        return reporte.id;
      },
      buscarReporte: (id) => estado.reportes.find((reporte) => reporte.id === id),
      marcarResuelto: (id) => despachar({ tipo: 'marcarResuelto', id }),
      agregarAviso: (aviso) =>
        despachar({ tipo: 'agregarAviso', aviso: { ...aviso, id: generarId(), fecha: Date.now() } }),
      cambiarPreferenciaAvisos: (activa) => despachar({ tipo: 'cambiarPreferenciaAvisos', activa }),
    }),
    [estado],
  );

  return <ContextoReportes.Provider value={valor}>{children}</ContextoReportes.Provider>;
}
