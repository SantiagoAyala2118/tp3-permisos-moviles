import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import configurarManejadorNotificaciones from '@/lib/notificaciones/configurarManejadorNotificaciones';
import ReportesProveedor from '@/lib/reportes/ReportesProveedor';
import tema from '@/lib/tema';

// Una sola vez al iniciar: cómo se muestran las notificaciones con la app abierta.
configurarManejadorNotificaciones();

const temaNavegacion = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: tema.colores.primario,
    background: tema.colores.fondo,
    card: tema.colores.fondo,
    text: tema.colores.texto,
    border: tema.colores.borde,
    notification: tema.colores.primario,
  },
};

/**
 * Stack raíz: los tabs van abajo de todo y el resto de las pantallas se apilan encima.
 * `/permisos/[recurso]` es la pantalla previa y se abre como modal.
 */
export default function LayoutRaiz() {
  return (
    <ReportesProveedor>
      <ThemeProvider value={temaNavegacion}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerBackButtonDisplayMode: 'minimal',
            headerShadowVisible: false,
            headerTintColor: tema.colores.texto,
            headerTitleStyle: { fontWeight: '700' },
            headerStyle: { backgroundColor: tema.colores.fondo },
            contentStyle: { backgroundColor: tema.colores.fondo },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="reporte/nuevo" options={{ title: 'Nuevo reporte' }} />
          <Stack.Screen name="reporte/escanear" options={{ title: 'Escanear QR del aula' }} />
          <Stack.Screen name="reporte/foto" options={{ title: 'Foto del desperfecto' }} />
          <Stack.Screen name="reporte/ubicacion" options={{ title: 'Ubicación del problema' }} />
          <Stack.Screen name="reporte/[id]" options={{ title: 'Detalle del reporte' }} />
          <Stack.Screen name="ajustes-app" options={{ title: 'Ajustes de la app' }} />
          <Stack.Screen
            name="permisos/[recurso]"
            // Sin botón para salir en el encabezado: la pantalla previa tiene un único botón (RF-6).
            options={{
              presentation: 'modal',
              title: 'Antes de continuar',
              headerBackVisible: false,
              headerStyle: { backgroundColor: tema.colores.superficie },
              contentStyle: { backgroundColor: tema.colores.superficie },
            }}
          />
        </Stack>
      </ThemeProvider>
    </ReportesProveedor>
  );
}
