# plan.md — Plan técnico (CÓMO se construye)

> Metodología SDD. Este documento traduce los requisitos de [spec.md](spec.md) en decisiones técnicas. Los pasos concretos están en [tasks.md](tasks.md).
> Toda API de Expo se verifica contra la documentación **v57** (`https://docs.expo.dev/versions/v57.0.0/`) antes de escribir el código (regla del `AGENTS.md`).

---

## 1. Punto de partida

- Proyecto ya creado con `create-expo-app` e inicializado en GitHub (rama `main`).
- `expo ~57.0.30`, `react-native 0.86.3`, `expo-router ~57.0.28`, TypeScript, React Compiler y typed routes activados en `app.json`.
- Usa **npm** (`package-lock.json`) → los comandos van con `npx`.
- La plantilla trae rutas y componentes de ejemplo (`src/app/index.tsx`, `src/app/explore.tsx`, `NativeTabs`, `themed-text`, `animated-icon`, etc.) que **se eliminan** porque no cumplen los nombres en español (LC-1) y no se usan.
- `/ios` y `/android` están en `.gitignore`: se generan con CNG (`npx expo prebuild`) y **nunca se editan a mano**.

## 2. Estructura de carpetas (simple, LC-4 / RT-5)

```
src/
├── app/                              ← SOLO rutas (cada archivo = una URL)
│   ├── _layout.tsx                   Stack raíz + ReportesProveedor + manejador de notificaciones
│   ├── (tabs)/
│   │   ├── _layout.tsx               Tabs: "Reportes", "Avisos", "Permisos"
│   │   ├── index.tsx                 →  /
│   │   ├── avisos.tsx                →  /avisos
│   │   └── permisos.tsx              →  /permisos
│   ├── permisos/
│   │   └── [recurso].tsx             →  /permisos/[recurso]   (presentation: "modal")
│   ├── reporte/
│   │   ├── nuevo.tsx                 →  /reporte/nuevo
│   │   ├── escanear.tsx              →  /reporte/escanear
│   │   ├── foto.tsx                  →  /reporte/foto
│   │   ├── ubicacion.tsx             →  /reporte/ubicacion
│   │   └── [id].tsx                  →  /reporte/[id]
│   └── ajustes-app.tsx               →  /ajustes-app
├── components/                       ← piezas visuales reutilizables (sin lógica de permisos)
│   ├── BotonPrincipal.tsx
│   ├── CampoTexto.tsx
│   ├── VistaCargando.tsx
│   ├── PantallaPrevia.tsx            beneficio + botón único + aclaración de Ajustes
│   ├── TarjetaReporte.tsx
│   ├── TarjetaPermiso.tsx
│   ├── SelectorCategoria.tsx
│   └── SelectorSector.tsx
├── hooks/
│   ├── usePermiso.ts                 RF-1 (hook unificado)
│   ├── useRevisarAlVolver.ts         receta E5 (AppState)
│   ├── useNavegarConPermiso.ts       "pedir en contexto": abre la pantalla previa o va directo
│   └── useReportes.ts                acceso al contexto de reportes
└── lib/
    ├── tema.ts                       colores y espaciados
    ├── permisos/
    │   ├── tipos.ts                  Recurso, EstadoPermiso, RespuestaPermiso, AdaptadorPermiso
    │   ├── clasificarRespuesta.ts    respuesta → 'cargando' | 'concedido' | 'preguntable' | 'bloqueado'
    │   ├── esAccesoParcial.ts        fotos limitadas / ubicación aproximada
    │   ├── adaptadorCamara.ts
    │   ├── adaptadorUbicacion.ts
    │   ├── adaptadorNotificaciones.ts
    │   ├── adaptadorGaleria.ts       solo consulta (nunca pide)
    │   ├── registroAdaptadores.ts    mapa recurso → adaptador
    │   └── textosPermisos.ts         beneficio, pasos en Ajustes por plataforma
    ├── ubicacion/
    │   └── obtenerUbicacion.ts       receta E2(c)
    ├── notificaciones/
    │   ├── crearCanalReportes.ts
    │   ├── configurarManejadorNotificaciones.ts
    │   └── programarAvisoResolucion.ts
    └── reportes/
        ├── tipos.ts                  Reporte, Borrador, Aviso, Categoria, Sector, EstadoReporte
        ├── reportesIniciales.ts      datos de ejemplo (uno por estado)
        ├── reducerReportes.ts
        └── ReportesProveedor.tsx     Context + useReducer
```

> Por qué `(tabs)` y `permisos/[recurso].tsx` por separado: `(tabs)/permisos.tsx` genera `/permisos` (un tab) y `permisos/[recurso].tsx` genera `/permisos/camara`, etc. como **modal del Stack raíz**, encima de los tabs. No chocan porque no existe `permisos/index.tsx`. Las rutas estáticas de `reporte/` (`nuevo`, `escanear`…) tienen prioridad sobre `reporte/[id]`.

## 3. Principios y patrones aplicados (LC-2)

| Principio / patrón | Dónde | Para qué |
|---|---|---|
| **Adapter** | `lib/permisos/adaptador*.ts` | Cada módulo de Expo tiene su API (`Camera.getCameraPermissionsAsync`, `Location.getForegroundPermissionsAsync`, `Notifications.getPermissionsAsync`…). Cada adaptador las envuelve en la **misma interfaz** `AdaptadorPermiso { consultar(), pedir() }`. |
| **Registry / Strategy** | `registroAdaptadores.ts` | `usePermiso(recurso)` elige el adaptador por clave. Agregar un recurso (ej. micrófono) = un adaptador nuevo + una línea en el registro, **sin tocar el hook** (Abierto/Cerrado). |
| **Responsabilidad única (S)** | `clasificarRespuesta`, `esAccesoParcial` | Funciones puras y testeables: solo traducen una respuesta. El hook solo maneja estado; los componentes solo dibujan. |
| **Inversión de dependencias (D)** | Pantallas → `usePermiso` / `useReportes` | Las pantallas dependen de abstracciones propias, no de `expo-location` o del Context directamente. (Excepción documentada: `/reporte/escanear` usa `useCameraPermissions` porque la consigna lo exige, pero clasifica con la misma función `clasificarRespuesta`.) |
| **Segregación de interfaces (I)** | Props de componentes | Cada componente recibe solo lo que necesita (ej. `PantallaPrevia` recibe textos y un `alPresionar`, no el hook entero). |
| **Contenedor / Presentacional** | `app/` vs `components/` | Las rutas orquestan (hooks, navegación); los componentes son visuales y reutilizables. |
| **Provider (Context + reducer)** | `ReportesProveedor.tsx` | Estado global de reportes, borrador y avisos sin librerías extra; cambios por acciones con nombre (`crearReporte`, `marcarResuelto`, `agregarAviso`…). |
| **Facade** | `obtenerUbicacion`, `programarAvisoResolucion` | Esconden varios pasos de la API detrás de una función con nombre de negocio. |

**Convenciones (LC-1, LC-3):**
- Español claro, sin tildes, `ñ` → `ni` (ej.: `disenio`). Componentes en `PascalCase`, funciones/hooks en `camelCase` (`use` + nombre en español: `usePermiso`).
- `export default` en componentes, hooks, rutas y funciones de `lib` (una por archivo). Los **tipos** de TypeScript se exportan con nombre (`export type …`) porque un archivo de tipos tiene varios.
- Importaciones con el alias `@/` ya configurado en `tsconfig.json`.

## 4. Modelo de permisos

### 4.1 Tipos (`lib/permisos/tipos.ts`)

```ts
export type Recurso = 'camara' | 'ubicacion' | 'notificaciones' | 'galeria';
export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

// Unión mínima de lo que devuelven los módulos de Expo
export type RespuestaPermiso = PermissionResponse & {
  accessPrivileges?: 'all' | 'limited' | 'none';          // expo-image-picker
  android?: { accuracy?: 'fine' | 'coarse' | 'none' };   // expo-location
  ios?: { accuracy?: 'full' | 'reduced'; scope?: string; status?: number }; // location / notifications
};

export type AdaptadorPermiso = {
  seSolicita: boolean;                     // galería = false (no se pide nunca)
  consultar: () => Promise<RespuestaPermiso>;
  pedir: () => Promise<RespuestaPermiso>;
};
```

### 4.2 Regla de clasificación (`clasificarRespuesta.ts`) — corazón de la defensa oral (pregunta 1)

| Respuesta | Estado |
|---|---|
| `null` | `'cargando'` |
| `granted === true` | `'concedido'` |
| `granted === false` y `canAskAgain === true` | `'preguntable'` → botón **"Continuar"** |
| `granted === false` y `canAskAgain === false` | `'bloqueado'` → botón **"Abrir Ajustes"** |

`esAccesoParcial(respuesta)` → `true` si `accessPrivileges === 'limited'`, `android.accuracy === 'coarse'` o `ios.accuracy === 'reduced'`.

### 4.3 Adaptadores

| Recurso | consultar | pedir | Detalle |
|---|---|---|---|
| `camara` | `Camera.getCameraPermissionsAsync()` | `Camera.requestCameraPermissionsAsync()` | Mismo permiso del SO que usa `ImagePicker.launchCameraAsync`. |
| `ubicacion` | `Location.getForegroundPermissionsAsync()` | `Location.requestForegroundPermissionsAsync()` | **Nunca** background. |
| `notificaciones` | `Notifications.getPermissionsAsync()` | `crearCanalReportes()` **y después** `Notifications.requestPermissionsAsync()` | En Android 13+ sin canal no aparece el diálogo (E3). |
| `galeria` | `ImagePicker.getMediaLibraryPermissionsAsync()` | — (devuelve la consulta) | `seSolicita: false`: solo se muestra en el panel con su `accessPrivileges`. |

### 4.4 Hooks

**`useRevisarAlVolver(revisar)`** — receta E5: escucha `AppState`; si el estado anterior era `background`/`inactive` y el nuevo es `active`, llama a `revisar()`; limpia con `sub.remove()`.

**`usePermiso(recurso)`** devuelve `{ estado, parcial, respuesta, seSolicita, pedir, abrirAjustes, consultar }`:
1. `respuesta` empieza en `null` → `estado = 'cargando'`.
2. Al montar llama a `consultar()` (**solo consulta, nunca pide** → RF-8).
3. `useRevisarAlVolver(consultar)` → se actualiza al volver de Ajustes (RF-1).
4. `useFocusEffect` de expo-router → se actualiza al cerrar el modal de pantalla previa (otra instancia del hook pudo cambiar el permiso).
5. `pedir()` llama al adaptador, guarda y devuelve la respuesta. `abrirAjustes()` = `Linking.openSettings()`.

**`useNavegarConPermiso(recurso)`** — implementa "pedir en contexto" (RF-6, RF-8). Devuelve `irConPermiso(destino?)`:
- si `estado === 'concedido'` → `router.push(destino)` (o devuelve `true` para que la pantalla ejecute la acción);
- si no → `router.push({ pathname: '/permisos/[recurso]', params: { recurso, destino } })`.
Solo se llama desde un `onPress`: nunca desde `useEffect`.

### 4.5 Pantalla previa `/permisos/[recurso]` (modal)

- Valida `recurso` (solo `camara`, `ubicacion`, `notificaciones`; otro valor → mensaje "Recurso desconocido").
- Usa `usePermiso(recurso)` y el componente `PantallaPrevia` con textos de `textosPermisos.ts`:
  - **preguntable**: beneficio en una frase + botón **"Continuar"** + "Podés cambiarlo cuando quieras en Ajustes". Al tocar: `pedir()` → `router.back()` → si quedó concedido y hay `destino`, `router.push(destino)`.
  - **bloqueado**: explicación de cómo habilitarlo (pasos por plataforma, OP-4) + botón **"Abrir Ajustes"**.
  - **concedido** (si se llega igual): vuelve o navega al destino.
- **Sin** "Ahora no" ni "Cerrar" (pauta 5.1.1(iv)). Se configura `gestureEnabled` normal del modal: la persona puede bajar el modal con el gesto del sistema, pero la pantalla no ofrece botones de rechazo.

## 5. Pantallas (comportamiento)

| Ruta | Lógica |
|---|---|
| `/` | Lista `TarjetaReporte` con estado (pendiente / en curso / resuelto). Botón "Nuevo reporte" → `/reporte/nuevo`. Acceso a `/ajustes-app` desde el encabezado. |
| `/reporte/nuevo` | Formulario sobre el **borrador** del contexto: título, descripción, aula (`CampoTexto`, editable a mano), categoría (`SelectorCategoria`). Botones: "Escanear QR del aula" (`irConPermiso('/reporte/escanear')`), "Adjuntar foto" (→ `/reporte/foto`, que no pide nada al abrir), "Marcar ubicación" (→ `/reporte/ubicacion`). "Guardar" valida título, aula y categoría; foto y ubicación son opcionales (RF-7). |
| `/reporte/escanear` | `useCameraPermissions()` + `useRevisarAlVolver(consultarPermiso)` + `clasificarRespuesta`. Cuatro estados: `VistaCargando` / `CameraView` con `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}` y `onBarcodeScanned` (con un `useRef` para leer una sola vez) / `PantallaPrevia` "Continuar" / `PantallaPrevia` "Abrir Ajustes". En los dos últimos, además, `CampoTexto` "Escribir el código del aula a mano" (RF-2). Al leer: guarda `aula` en el borrador y vuelve. |
| `/reporte/foto` | "Elegir de la galería" → `ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] })` **sin pedir nada** (RF-3). "Sacar foto" → `irConPermiso()`; si está concedido, `ImagePicker.launchCameraAsync()`. Si la cámara está denegada, se muestra que se puede usar el selector. Vista previa con `expo-image`. |
| `/reporte/ubicacion` | Botón "Usar mi ubicación actual" → `irConPermiso()`; si está concedido, `obtenerUbicacion()`. Si `aproximada` → muestra **"Ubicación aproximada"**, si no, latitud/longitud. Siempre visible `SelectorSector` (patio, estacionamiento, pasillo, hall, otro) como alternativa (RF-4). |
| `/reporte/[id]` | Valida `id` con `useLocalSearchParams`; si no existe → "No encontramos ese reporte" + volver. Muestra datos, foto, ubicación o sector, estado. "Simular resolución": marca `resuelto`; si notificaciones **concedidas** y preferencia activa → `programarAvisoResolucion(reporte)` (10 s); si no → `agregarAviso(...)` en la bandeja (RF-5). |
| `/avisos` | Lista de avisos del contexto (vacía → mensaje explicativo). |
| `/permisos` | `TarjetaPermiso` por recurso con: estado, `Platform.OS`, matiz (`accessPrivileges`, `android.accuracy` / `ios.accuracy`) y botón según estado ("Continuar" → pantalla previa / "Abrir Ajustes"). La galería figura como "No se pide: usamos el selector del sistema". Se refresca al volver (RF-9, RF-1). |
| `/ajustes-app` | `Switch` "Avisarme cuando se resuelva mi reporte". Valor visible = `preferenciaAvisos && notificaciones concedidas`. Al activarlo: guarda la preferencia y, si no está concedido, `irConPermiso()` (abre la pantalla previa). Si queda denegado: "Te avisaremos en la pestaña Avisos". Es **el único lugar** que pide notificaciones (RF-5). |

## 6. Notificaciones

- `configurarManejadorNotificaciones()` se llama una vez en `src/app/_layout.tsx`: `setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }) })`.
- `crearCanalReportes()` (solo Android): `setNotificationChannelAsync('reportes', { name: 'Reportes', importance: AndroidImportance.HIGH })`.
- `programarAvisoResolucion(reporte)`: `scheduleNotificationAsync({ content: { title, body }, trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10, channelId: 'reportes' } })`.
- OP-2: `requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true, allowProvisional: true } })` y detectar `respuesta.ios?.status === IosAuthorizationStatus.PROVISIONAL`.

## 7. Configuración `app.json` (RT-3, RT-4)

```jsonc
"plugins": [
  "expo-router",
  ["expo-splash-screen", { ... }],              // se mantiene de la plantilla
  ["expo-camera", {
    "cameraPermission": "Usamos tu cámara para leer el código QR del aula y sacar la foto del desperfecto que reportás.",
    "microphonePermission": false,
    "recordAudioAndroid": false
  }],
  ["expo-location", {
    "locationWhenInUsePermission": "Usamos tu ubicación para marcar en qué lugar del instituto está el desperfecto que reportás.",
    // Las claves "siempre" y de movimiento las exige Apple porque la librería contiene esas APIs (C2 d):
    // se reemplaza el texto genérico en inglés por uno honesto, aunque la app nunca las pida.
    "locationAlwaysAndWhenInUsePermission": "Usamos tu ubicación solo mientras usás la app, para marcar dónde está el desperfecto. No la seguimos en segundo plano.",
    "locationAlwaysPermission": "(mismo texto)",
    "motionUsagePermission": "Mantenimiento IPF no usa los sensores de movimiento de tu dispositivo.",
    "isAndroidBackgroundLocationEnabled": false,
    "isIosBackgroundLocationEnabled": false
  }],
  ["expo-image-picker", {
    "photosPermission": "Usamos tus fotos solo cuando elegís una imagen del desperfecto para adjuntarla al reporte.",
    "cameraPermission": "(mismo texto que expo-camera)",  // ¡nunca false! bloquearía CAMERA en Android
    "microphonePermission": false
  }],
  ["expo-notifications", { "color": "#208AEF" }]
],
"android": {
  "blockedPermissions": [
    "android.permission.RECORD_AUDIO",
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_MEDIA_IMAGES",
    "android.permission.READ_MEDIA_VIDEO",
    "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
    "android.permission.SYSTEM_ALERT_WINDOW"
  ]
}
```
La lista final se confirma con `npx expo prebuild --clean` leyendo el `AndroidManifest.xml` generado (OP-1). Cada bloqueado se justifica en el README.

> Nota: `expo-camera` y `expo-image-picker` comparten `NSCameraUsageDescription`; se usa **el mismo texto** en los dos para evitar que uno pise al otro.

## 8. Dependencias

Instalar con `npx expo install` (RT-2): `expo-camera`, `expo-location`, `expo-image-picker`, `expo-notifications`, `@expo/vector-icons` (íconos de tabs). Para la dev build: `expo-dev-client`. Opcional OP-3: `expo-audio`. Ya instalados y reutilizados: `expo-image`, `expo-router`, `expo-linking`.

## 9. Estrategia de pruebas

| Dónde | Qué se prueba |
|---|---|
| **Expo Go** | Flujo de pantallas, 4 estados del escáner, selector de fotos, ubicación (precisa/aproximada/denegada), notificación **local**, panel y vuelta de Ajustes. *Los textos de propósito y `blockedPermissions` no aplican* (Expo Go es otra app con su propio Info.plist/manifiesto). |
| **Development build (Android)** | Diálogo con nuestro texto (en iOS) / manifiesto sin permisos bloqueados, captura E-4. Comandos: `npx expo install expo-dev-client` → `npx expo run:android` (local) o `npx eas-cli@latest build --profile development --platform android`. |
| **Reset a "sin decidir"** | Android: `adb shell pm reset-permissions <paquete>` o `adb shell pm revoke <paquete> android.permission.CAMERA`. iOS simulador: `xcrun simctl privacy booted reset all <bundleId>`. |
| **Calidad** | `npx expo lint`, `npx tsc --noEmit`, `npx expo-doctor` antes de cerrar cada tarea. |

## 10. Mapa defensa oral → código

| Pregunta G6 | Dónde mostrarlo |
|---|---|
| 1. "Continuar" vs "Abrir Ajustes" | `lib/permisos/clasificarRespuesta.ts` (campo `canAskAgain`) + `app/permisos/[recurso].tsx` |
| 2. Revocar con la app abierta | Android **mata el proceso**; al volver la app se recrea y `useRevisarAlVolver` / montaje vuelven a consultar (`hooks/useRevisarAlVolver.ts`). |
| 3. Elegir foto vs sacarla | `app/reporte/foto.tsx`: el selector del sistema corre fuera de la app (la persona elige) vs la cámara, que da acceso al sensor. |
| 4. Ubicación aproximada / denegada | `lib/ubicacion/obtenerUbicacion.ts` + `app/reporte/ubicacion.tsx` |
| 5. Textos en Expo Go | Expo Go usa su propio Info.plist; los nuestros solo entran al compilar (`app.json` → prebuild). |
| 6. Nota de voz por OTA | No: agrega un permiso nativo (Info.plist / manifiesto) → requiere nueva build. |

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| APIs de SDK 57 distintas a lo recordado | Consultar docs v57 en cada tarea. |
| `Tabs` / `useFocusEffect` con cambios en expo-router 57 | Verificar en docs de Expo Router antes de TASK 4. |
| `blockedPermissions` quita algo que una librería necesita | Probar en dev build y auditar el manifiesto. |
| Sin Mac para iOS | La dev build obligatoria se hace en Android; la captura del texto de propósito de iOS requiere iOS → si no hay acceso, se documenta en el README. |
