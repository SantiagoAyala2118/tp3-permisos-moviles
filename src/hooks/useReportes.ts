import { useContext } from 'react';

import { ContextoReportes, type ValorContextoReportes } from '@/lib/reportes/ReportesProveedor';

/** Acceso al estado de reportes. Las pantallas dependen de este hook, no del Context directo. */
export default function useReportes(): ValorContextoReportes {
  const valor = useContext(ContextoReportes);
  if (!valor) {
    throw new Error('useReportes se tiene que usar dentro de <ReportesProveedor>.');
  }
  return valor;
}
