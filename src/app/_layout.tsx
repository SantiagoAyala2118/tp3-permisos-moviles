import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import tema from '@/lib/tema';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: tema.colores.primario,
    background: tema.colores.fondo,
    card: tema.colores.superficie,
    text: tema.colores.texto,
    border: tema.colores.borde,
  },
};

/**
 * Stack raíz: los tabs van abajo de todo y el resto de las pantallas se apilan encima.
 * `/permisos/[recurso]` es la pantalla previa y se abre como modal.
 */
export default function LayoutRaiz() {
  return (
    <ThemeProvider value={temaNavegacion}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
        <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear QR del aula' }} />
        <Stack.Screen name="reporte/foto" options={{ title: 'Foto del desperfecto' }} />
        <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación del problema' }} />
        <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle del reporte' }} />
        <Stack.Screen name="ajustes-app" options={{ title: 'Ajustes de la app' }} />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{ presentation: 'modal', title: 'Antes de continuar' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
