# spec.md — Especificación (QUÉ hay que entregar)

> Metodología SDD. Este documento es la **fuente de verdad de los requisitos**. Si algo no está acá, no se hace; si está acá, se tiene que cumplir.
> Documento origen: *TP N° 3 — Permisos móviles: Android, iOS y Expo* (Taller Complementario React Native II, Instituto Politécnico Formosa).
> Documentos relacionados: [plan.md](plan.md) (CÓMO) y [tasks.md](tasks.md) (PASOS).

---

## 1. Objetivo

Aplicar la teoría de permisos móviles para que una app hecha con **React Native + Expo (SDK 57)** pida acceso a **cámara, ubicación, fotos y notificaciones en el momento justo**, lea la respuesta del sistema y tenga **un camino alternativo para cada caso**, en Android y en iOS.

## 2. Alcance y modalidad

| Parte | Qué es | Dónde se entrega |
|---|---|---|
| A a F | Preguntas y ejercicios cortos | `RESPUESTAS.md` en la raíz del repositorio |
| G | Desarrollo de la app "Mantenimiento IPF" | Código del proyecto + `README.md` |

- Todo va en **un único repositorio** (este).
- Material de consulta: presentación de clase "Permisos móviles" (archivo `permisos_moviles/index (1).html`) y la guía oficial de Expo (docs.expo.dev/guides/permissions).

## 3. Entregables (G5)

| ID | Entregable | Detalle |
|---|---|---|
| E-1 | Repositorio funcionando | Sin `node_modules`. |
| E-2 | `RESPUESTAS.md` | Respuestas de las Partes A a F (ver §4). |
| E-3 | `README.md` | (a) árbol de carpetas de `src/app`; (b) bloque `plugins` de `app.json` comentado; (c) tabla de permisos: recurso, módulo, cuándo se pide, alternativa; (d) justificación de cada `blockedPermissions`; (e) capturas o video corto de: escáner en sus 4 estados, ubicación concedida y denegada, foto desde el selector, notificación recibida, panel de permisos antes y después de volver de Ajustes. |
| E-4 | Captura del diálogo del sistema | En una **development build**, donde se vea **nuestro texto de propósito**. |

---

## 4. Requisitos de `RESPUESTAS.md` (Partes A a F)

Cada ítem es obligatorio. Estilo pedido: **lenguaje simple, no excesivamente técnico**, apoyado en el HTML de clase; si algo no está en el HTML, se consulta documentación oficial (Expo, Android, Apple). Las tablas del PDF se responden **como tablas**.

### Parte A — ¿Qué es un permiso y por qué existe?
- **A1** Conceptos: (a) qué es un permiso y el papel de la app, el SO y la persona usuaria; (b) sandbox y su relación con los permisos, qué puede hacer una app sin permisos; (c) las cuatro razones de los permisos con un ejemplo concreto cada una; (d) analogía del portero: visita, portero, dueño; qué significa "el portero se acuerda de la respuesta".
- **A2** Tabla Declarar (al compilar) vs Solicitar (al ejecutar): qué se hace; dónde/cómo en Android, iOS y Expo; qué pasa si se omite.
- **A3** Verdadero/Falso (a–h), justificando las falsas.
- **A4** (a) diagrama de estados en Android e iOS y la diferencia central; (b) tabla status / canAskAgain / ¿puede aparecer el diálogo? para: sin decidir, concedido, denegado (se puede volver a pedir), bloqueado.

### Parte B — Android
- **B1** Tabla de tipo (instalación / tiempo de ejecución / especial) y cómo se obtiene: INTERNET, CAMERA, VIBRATE, SYSTEM_ALERT_WINDOW, POST_NOTIFICATIONS, ACCESS_NETWORK_STATE, READ_CONTACTS, SCHEDULE_EXACT_ALARM, RECORD_AUDIO, MANAGE_EXTERNAL_STORAGE.
- **B2** (a) grupos de permisos y cuántos diálogos con FINE + COARSE; (b) prefijo y nombre completo del permiso de cámara; (c) permisos de firma y por qué no se usan en apps comunes.
- **B3** Lectura del manifiesto dado: (a) cuáles se conceden al instalar y cuáles se piden; (b) `maxSdkVersion="32"` y reemplazos de READ_EXTERNAL_STORAGE desde Android 13; (c) `tools:node="remove"` y el fragmento de `app.json` que lo genera; (d) propiedad de `app.json` para SCHEDULE_EXACT_ALARM; (e) por qué no editar a mano y si `blockedPermissions` funciona en Expo Go.
- **B4** (a) texto propio en el diálogo de Android y dónde explicar; (b) "Mientras la app está en uso" vs "Solo esta vez" y para qué permisos existe; (c) dos "No permitir" en Android 11+ y valor de canAskAgain; (d) ejemplo de función que anda con ubicación aproximada (~3 km²) y otra que no; (e) qué hace Android con el proceso si se revoca desde Ajustes.
- **B5** Tabla versión (API) + implicancia en el código para: permisos en tiempo de ejecución, ubicación en segundo plano aparte, dos rechazos = no volver a preguntar, ubicación precisa/aproximada, POST_NOTIFICATIONS, acceso parcial a fotos, ACCESS_LOCAL_NETWORK. Además: qué es `targetSdkVersion`, a qué API apunta SDK 57 y qué exige Google Play desde el 31/08/2026.

### Parte C — iOS
- **C1** Tabla de claves Info.plist: cámara, micrófono, ubicación en uso, ubicación siempre, fotos (leer), fotos (solo guardar), contactos, Face ID, ATT, notificaciones (indicar si no lleva clave).
- **C2** (a) qué pasa sin texto de propósito al usar la cámara y al subir a App Store Connect (con código de error); (b) cuántas veces muestra iOS el diálogo y qué le queda a la app si dicen que no; (c) qué parte del diálogo arma el sistema, cuál escribimos y dónde se configura en Expo; (d) librería que usa una API protegida que la app no llama: por qué rechazan y cómo se resuelve.
- **C3** Evaluar 5 textos para `NSLocationWhenInUseUsageDescription` según la pauta 5.1.1 y reescribir los rechazados con el molde "Usamos tu [dato] para [beneficio concreto]".
- **C4** Tabla iOS desde qué versión + valor/función de Expo: fotos limitadas, ubicación aproximada, "Permitir una vez", ubicación escalonada, notificaciones provisionales, ATT. Además: iOS mínimo de SDK 57 y su consecuencia sobre la tabla.
- **C5** Tabla comparativa Android vs iOS: dónde se declara, texto en el diálogo, oportunidades para preguntar, "solo esta vez", notificaciones, segundo plano, si falta la declaración.

### Parte D — Expo
- **D1** Tabla módulo + hook/función para 8 necesidades (QR, video con sonido, farmacias cercanas, envío en segundo plano, recordatorio, nota de voz, galería propia, publicidad entre apps iOS). Además: qué indica un tutorial con `expo-permissions`.
- **D2** (a) `get…` vs `request…` y cuál muestra diálogo; (b) los tres elementos del hook, valor en el primer render y qué mostrar; (c) `request…` con canAskAgain=false y el problema de llamarlo en bucle.
- **D3** Tabla qué hace la app para 7 `PermissionResponse`; y cuáles son los dos campos que deciden casi todo y qué pregunta responde cada uno.
- **D4** Simulación de 6 pasos en Android 14 (status, canAskAgain, ¿diálogo?); repetir pasos 1–4 en iOS, en qué paso cambia y por qué; "Permitir una vez" + cerrar y reabrir en iOS.
- **D5** Bloque `expo.plugins` (+ `expo.android`) para: QR sin video (sin micrófono iOS, sin RECORD_AUDIO Android), ubicación solo en primer plano para puntos de reciclaje, sin SYSTEM_ALERT_WINDOW. Además: por qué expo-camera agrega RECORD_AUDIO.
- **D6** (a) por qué no aparecen los textos en Expo Go; (b) qué se prueba en Expo Go y qué requiere dev build (push Android, segundo plano); (c) comandos para ver nativos generados y compilar dev build Android; (d) volver a "sin decidir" con adb y con `xcrun simctl`.

### Parte E — Recetas de código
- **E1** Encontrar al menos 3 errores en `escanear.tsx` y escribir la versión corregida con los 4 estados (cargando → concedido → preguntable → bloqueado).
- **E2** (a) qué está mal en el orden y qué ocurre en iOS y Android 11+; (b) reescribir `activarSeguimiento`; (c) escribir `obtenerUbicacion()` que devuelva coordenadas + booleano `aproximada` (Android y iOS) o `null` si se deniega; (d) si hace falta segundo plano para farmacias y qué exige Google Play.
- **E3** (a) causa probable de que no aparezca el diálogo en Android 14 y qué hacer antes; (b) Android ≤ 12; (c) opción de iOS sin diálogo y cómo detectarla; (d) buen y mal momento para pedirlo.
- **E4** Tabla herramienta + permiso para 4 necesidades de fotos. Además: por qué Google Play restringe READ_MEDIA_IMAGES/VIDEO, desde cuándo, y qué es "el mejor permiso".
- **E5** Completar los 3 espacios del hook `useRevisarAlVolver` y responder (a) por qué los hooks no se enteran solos; (b) qué función del hook de cámara se pasa; (c) por qué no guardar el permiso en un store global para siempre.

### Parte F — Buenas prácticas y tiendas
- **F1** Tabla cuándo pedir + alternativa para 6 casos (delivery, billetera, red social, mensajería, turnos médicos, editor de fotos). Además: por qué pedir 4 permisos al abrir "entrena el No permitir automático".
- **F2** (a) los tres elementos de una buena pantalla previa; (b) por qué "Continuar" y no "Permitir"; (c) pauta 5.1.1(iv) sobre "Ahora no"/"Cerrar"; (d) cómo cambia si está bloqueado.
- **F3** Mínimo privilegio, elegir y justificar (a–d).
- **F4** (a) dos requisitos de Google Play y dos de App Store; (b) `PrivacyInfo.xcprivacy` y dónde se configura en Expo; (c) qué suma Android 17 y qué exige Google Play desde el 27/01/2027 a apps con READ_CONTACTS.
- **F5** Causa y solución para 5 errores comunes (a–e).

---

## 5. Parte G — App "Mantenimiento IPF"

**Contexto:** alumnos y docentes reportan desperfectos del edificio (luz quemada, canilla que pierde, proyector roto) y reciben un aviso cuando se resuelven. Usa cámara, ubicación y notificaciones, y **elige fotos sin pedir permiso de galería**.

### 5.1 Rutas requeridas (G1)

La app debe responder **exactamente** a estas URLs.

| URL | Pantalla | Permiso / detalle |
|---|---|---|
| `/` | Inicio: lista de reportes propios con su estado (pendiente, en curso, resuelto) y botón "Nuevo reporte". | Ninguno. Tab **"Reportes"**. |
| `/reporte/nuevo` | Formulario: título, descripción, aula y categoría (electricidad, agua, mobiliario, equipos). Botones para escanear, adjuntar foto y marcar ubicación. | **Ninguno al abrir**: cada permiso se pide recién al tocar su función. |
| `/reporte/escanear` | Lee el QR pegado en la puerta del aula y completa el campo "aula". | Cámara (`useCameraPermissions`), con los **cuatro estados**. |
| `/reporte/foto` | Adjuntar foto del desperfecto: "Sacar foto" o "Elegir de la galería". | Cámara para sacar; **selector del sistema (sin permiso)** para elegir. |
| `/reporte/ubicacion` | Marca dónde está el problema (patio, estacionamiento, pasillo) con la ubicación actual. | Ubicación en **primer plano**. Si se deniega: elegir el sector a mano. |
| `/reporte/[id]` | Detalle: datos, foto, ubicación o sector y estado. Botón de prueba "Simular resolución". | **Validar el id**; mensaje si no existe. |
| `/avisos` | Bandeja de avisos dentro de la app. | Alternativa a las notificaciones. Tab **"Avisos"**. |
| `/permisos` | Panel con el estado de cada permiso (concedido, preguntable, bloqueado, parcial) y botón para pedir o abrir Ajustes. | Tab **"Permisos"**. Se actualiza al volver de Ajustes. |
| `/permisos/[recurso]` | Pantalla previa: beneficio en una frase, botón "Continuar" y aclaración de que se puede cambiar en Ajustes. | `presentation: "modal"`. |
| `/ajustes-app` | Interruptor "Avisarme cuando se resuelva mi reporte". | Notificaciones, pedidas **al activar** el interruptor. |

### 5.2 Requisitos funcionales (G2)

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| **RF-1** | **Hook unificado** `src/hooks/usePermiso.ts`: `usePermiso(recurso)` devuelve `estado: 'cargando' \| 'concedido' \| 'preguntable' \| 'bloqueado'`, un indicador `parcial` (fotos limitadas o ubicación aproximada) y las funciones `pedir()` y `abrirAjustes()`. Se actualiza al volver de Ajustes usando `AppState`. | Revocar/conceder desde Ajustes y volver cambia el estado sin reiniciar la app. |
| **RF-2** | **Escáner con cuatro estados** en `/reporte/escanear`: indicador de carga, cámara, explicación con "Continuar" o aviso de bloqueado con "Abrir Ajustes". Si la cámara se deniega, se puede **escribir el código del aula a mano**. | Se ven los 4 estados; con cámara denegada se completa "aula" igual. |
| **RF-3** | **Foto sin permiso de galería**: "Elegir de la galería" usa `ImagePicker.launchImageLibraryAsync`; la app **no declara** READ_MEDIA_IMAGES ni pide acceso a la galería. | El selector abre sin diálogo; el manifiesto no contiene READ_MEDIA_IMAGES. |
| **RF-4** | **Ubicación respetuosa**: solo primer plano. Si es aproximada, no se muestran coordenadas exactas sino el texto "Ubicación aproximada". Si se deniega, el reporte se carga con el **sector elegido a mano**. | Probar las 3 ramas: precisa, aproximada, denegada. |
| **RF-5** | **Notificaciones en contexto**: el permiso se pide **únicamente** al activar el interruptor de `/ajustes-app`. En Android se crea el canal **"reportes"** antes de pedir. "Simular resolución" programa una **notificación local a los 10 segundos**; si el permiso está denegado, el aviso aparece en `/avisos`. | Ninguna otra pantalla pide notificaciones; la notificación llega a los 10 s o el aviso aparece en la bandeja. |
| **RF-6** | **Pantallas previas**: antes de cada diálogo del sistema se muestra `/permisos/[recurso]` con un **único botón "Continuar"**, **sin** "Ahora no" ni "Cerrar". Si el permiso está bloqueado, explica cómo habilitarlo y el botón pasa a ser **"Abrir Ajustes"**. | Ningún diálogo del sistema aparece sin pantalla previa antes. |
| **RF-7** | **La app nunca se bloquea**: ningún permiso denegado impide crear un reporte. Alternativas: código a mano, foto desde el selector, sector a mano, bandeja de avisos. | Con todos los permisos denegados se crea un reporte completo. |
| **RF-8** | **No insistir**: si la persona ya dijo que no, la pantalla previa no vuelve a aparecer sola; solo cuando toca otra vez la función. | No hay pedidos ni navegaciones a la pantalla previa disparados en `useEffect`/al montar. |
| **RF-9** | **Panel de permisos**: `/permisos` muestra cada recurso con su estado, la plataforma (`Platform.OS`) y el matiz cuando corresponda (`accessPrivileges`, `accuracy`). | El panel muestra "parcial" con fotos limitadas / ubicación aproximada. |

### 5.3 Requisitos técnicos (G3)

| ID | Requisito |
|---|---|
| **RT-1** | Proyecto con `create-expo-app`, **Expo SDK 57**, **TypeScript** y **Expo Router** (ya creado). |
| **RT-2** | Paquetes instalados **solo** con `npx expo install`: `expo-camera`, `expo-location`, `expo-image-picker`, `expo-notifications`. **Prohibido** `expo-permissions`. |
| **RT-3** | `app.json` con el **plugin de cada módulo** y **textos de propósito propios** con el molde "Usamos tu [dato] para [beneficio concreto]". |
| **RT-4** | **Mínimo privilegio**: `microphonePermission: false` y `recordAudioAndroid: false` en `expo-camera`; `android.blockedPermissions` con los permisos que la app no usa, **cada uno justificado en el README**. |
| **RT-5** | Organización: rutas en `src/app`, componentes en `src/components`, hooks en `src/hooks`, lógica de permisos en `src/lib`. |
| **RT-6** | Probado en **Expo Go** y en **al menos una development build** (Android o iOS). |

### 5.4 Lineamientos de código (pedidos por Santiago)

| ID | Lineamiento |
|---|---|
| **LC-1** | Nombres de funciones, hooks, componentes, variables y archivos **en español, claros**, sin tildes y con **`ni` en lugar de `ñ`** (ej.: `disenio`, `anio`, `pequenio`). Excepción: nombres que impone una librería o la consigna (`useCameraPermissions`, `presentation`, rutas exactas). |
| **LC-2** | Aplicar **principios SOLID** y **patrones de diseño** para mejorar lectura, escalabilidad e independencia, reduciendo el acoplamiento (detallado en `plan.md` §3). |
| **LC-3** | Todo componente (y hook) usa **`export default` / `import X from`**, salvo que se requiera otra forma (ej.: tipos de TypeScript, que van con export nombrado). |
| **LC-4** | Estructura de carpetas **simple** (actividad académica). |
| **LC-5** | Antes de cerrar cada tarea: `npx expo lint` y `npx tsc --noEmit` sin errores. |

### 5.5 Desafíos opcionales (G4, hasta +10 puntos)

| ID | Desafío |
|---|---|
| OP-1 | **Auditoría del manifiesto**: correr `npx expo prebuild --clean` y listar en el README cada permiso del `AndroidManifest.xml` generado, quién lo agrega y si se quitó. |
| OP-2 | **Notificaciones provisionales** (iOS): pedir con `allowProvisional: true` y mostrar en `/permisos` cuando el estado es provisional. |
| OP-3 | **Nota de voz** con `expo-audio` (`requestRecordingPermissionsAsync`), activando el micrófono solo para esa función. |
| OP-4 | **Bloqueo por plataforma**: pantalla de "permiso bloqueado" con el camino exacto en Ajustes para Android y para iOS. |

> Nota: OP-3 contradice RT-4 (micrófono bloqueado). Si se hace, se habilita el micrófono **solo** vía el plugin de `expo-audio` y se ajusta `blockedPermissions` y su justificación en el README. Se decide al llegar a esa tarea.

### 5.6 Defensa oral (G6) — el código debe permitir responder:
1. Mostrar el código que decide entre "Continuar" y "Abrir Ajustes" y qué campo de la respuesta lo decide (`canAskAgain`).
2. Revocar la cámara desde Ajustes con la app abierta y volver: qué hace Android con la app y cómo se entera el código (`AppState`).
3. Por qué no se pide permiso para elegir una foto, pero sí para sacarla.
4. Qué cambia si la ubicación es aproximada y si se deniega.
5. Por qué los textos de propósito no aparecían en Expo Go.
6. Si mañana se agrega la nota de voz, ¿alcanza con una actualización OTA? ¿Por qué?

### 5.7 Criterios de evaluación (G7)

| Criterio | Puntos |
|---|---|
| Partes A a F | 40 |
| Hook `usePermiso` y los cuatro estados, incluido volver de Ajustes | 15 |
| Pedidos en contexto, pantallas previas y alternativas | 15 |
| `app.json`: plugins, textos de propósito y mínimo privilegio | 10 |
| Funciones del sistema: escáner, foto, ubicación y notificaciones | 10 |
| Organización del código, README y defensa oral | 10 |
| **Total** | **100** |
| Desafíos opcionales | hasta +10 |

---

## 6. Fuera de alcance
- Backend o sincronización real de reportes: los reportes viven en memoria (el "estado" se cambia con "Simular resolución").
- Notificaciones push remotas (solo locales).
- Ubicación en segundo plano (prohibida por mínimo privilegio).

## 7. Trazabilidad (consigna → requisito → tarea)

| Consigna PDF | Requisito | Tarea (`tasks.md`) |
|---|---|---|
| Partes A–F | §4 | TASK 1 |
| G3 paquetes, app.json | RT-1…RT-4 | TASK 2 |
| G2.1 hook | RF-1 | TASK 3 |
| G1 rutas, G3 organización | RT-5 | TASK 4 |
| G1 `/`, `/reporte/nuevo`, `/reporte/[id]` | RF-7 | TASK 5 |
| G1 `/permisos/[recurso]`, G2.6, G2.8 | RF-6, RF-8 | TASK 6 |
| G2.2 escáner | RF-2 | TASK 7 |
| G2.3 foto | RF-3 | TASK 8 |
| G2.4 ubicación | RF-4 | TASK 9 |
| G2.5 notificaciones, `/avisos`, `/ajustes-app` | RF-5 | TASK 10 |
| G2.9 panel | RF-9 | TASK 11 |
| G3 pruebas Expo Go + dev build | RT-6, LC-5 | TASK 12 |
| G5 README + capturas | E-3, E-4 | TASK 13 |
| G4 opcionales | OP-1…OP-4 | TASK 14 |
| G6 defensa | §5.6 | TASK 15 |
