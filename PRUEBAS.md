# PRUEBAS.md — Guía de pruebas manuales (TASK 12)

> Este archivo **no es un entregable** de la consigna. Es una guía de apoyo para probar la app y saber qué capturas sacar. Marcar las casillas es opcional. Sirve además como evidencia de RT-6 ("probado en Expo Go y en una development build").

Recorrido para comprobar en el celular **cada requisito** de [spec.md](spec.md) y sacar, de paso, las capturas que pide el README (E-3). Marcá cada casilla a medida que la pruebes.

> 📸 = de ese paso sale una captura para el README. Guardalas en `docs/capturas/` con el nombre que se indica.

---

## 1. Preparación

### 1.1 Expo Go (prueba de la lógica)
1. Instalá **Expo Go para SDK 57**. ⚠️ El Expo Go del Play Store/App Store solo soporta el **último** SDK (hoy, el 58). Con ese, nuestro proyecto (SDK 57, como pide la consigna) da error de incompatibilidad.
   - **Android:** desinstalá el Expo Go del Play Store e instalá la versión 57 desde la página oficial https://expo.dev/go (elegí *SDK 57* → *Android* → *Device*). Ahí está el APK `Expo-Go-57.0.9.apk`.
   - **iOS:** no permite instalar versiones viejas de Expo Go. Usá la development build.
2. En la PC, desde la carpeta del proyecto, arrancá el servidor **en modo Expo Go** (`--go`):
   ```bash
   npx expo start --go
   ```
   Desde que instalamos `expo-dev-client`, `npx expo start` a secas genera un QR para la **development build**, no para Expo Go: por eso el celular "salía" de la app. Si ya lo arrancaste sin `--go`, apretá **`s`** en la terminal para cambiar a Expo Go.
3. Abrí el proyecto:
   - **Android:** abrí la app Expo Go y usá **"Scan QR code"** desde adentro de Expo Go.
   - **iOS:** escaneá el QR con la app Cámara.
   - Si el QR no anda: en Expo Go, **"Enter URL manually"** y escribí la dirección `exp://…` que muestra la terminal.
   - Celular y PC tienen que estar en la misma red Wi-Fi; si no conecta, usá `npx expo start --go --tunnel`.

> ⚠️ **La versión web (`w` en la terminal) no sirve para probar permisos:** en el navegador, el escáner de QR descarga un archivo desde un CDN que tu red bloquea, y los permisos los maneja el navegador, no Android/iOS. La consigna pide probar en **Expo Go** y en una **development build**.

> ⚠️ **Cambiar permisos en Ajustes y volver puede no reflejarse en Expo Go.** Los permisos son de la app **Expo Go** (no existe "Mantenimiento IPF" hasta instalar la development build), y en Android Expo Go además guarda su propia decisión **por proyecto**: a veces ignora lo que cambiás en Ajustes. Para resetear todo: Ajustes → Apps → Expo Go → Almacenamiento → **Borrar datos**. La prueba "volver de Ajustes" (panel antes/después) hacela en la **development build**.

> ⚠️ En Expo Go los **diálogos son los de Expo Go**: no aparecen nuestros textos de propósito y `blockedPermissions` no aplica. Los permisos que concedas quedan guardados **para Expo Go**, no para nuestra app.

### 1.2 Development build (nuestra app de verdad)
La PC no tiene SDK de Android, así que la build se compila **en la nube con EAS**:

1. Crear una cuenta gratis en https://expo.dev e iniciar sesión (lo hacés vos):
   ```bash
   npx eas-cli@latest login
   ```
2. Vincular el proyecto (agrega `extra.eas.projectId` a `app.json`; ese cambio se commitea):
   ```bash
   npx eas-cli@latest init
   ```
3. Compilar la development build de Android (tarda unos minutos; al final da un link/QR para descargar el APK):
   ```bash
   npx eas-cli@latest build --profile development --platform android
   ```
4. Instalar el APK en el celular (permitir "instalar apps desconocidas" si lo pide).
5. Levantar el servidor **sin** `--go` (modo development build):
   ```bash
   npx expo start
   ```
6. Abrir la app **Mantenimiento IPF** instalada: muestra los servidores de la red, o se escanea el QR **desde adentro de esa app**.
   ⚠️ No escanees el QR con la cámara del celular: se abre el navegador y da *HTTP ERROR 404* en `/_expo/link`.

### 1.3 Volver un permiso a "sin decidir"
- **Lo más simple:** desinstalar y reinstalar la app (en Expo Go: Ajustes → Apps → Expo Go → Almacenamiento → **Borrar datos**).
- **Con adb** (requiere instalar *Android SDK Platform-Tools*): `adb shell pm revoke com.santiagoayala.mantenimientoipf android.permission.CAMERA`.
- **iOS (simulador):** `xcrun simctl privacy booted reset all com.santiagoayala.mantenimientoipf`.

---

## 2. Recorrido por requisito

### Navegación y reportes (G1, RF-7)
- [ ] Los 3 tabs (**Reportes**, **Avisos**, **Permisos**) funcionan y el engranaje de Reportes abre **Ajustes de la app**.
- [ ] Inicio muestra los 3 reportes de ejemplo con estado **Pendiente / En curso / Resuelto**.
- [ ] **Nuevo reporte** abre **sin ningún diálogo de permiso**.
- [ ] Guardar vacío muestra los errores (título, aula, categoría).
- [ ] Con título + aula escrita a mano + categoría se guarda y abre el detalle.
- [ ] Abrir una URL inexistente (`npx expo start` → en la terminal, o un enlace a `/reporte/xyz`) muestra **"No encontramos ese reporte"**.

### Pantalla previa y "no insistir" (RF-6, RF-8)
- [ ] Tocar **Escanear QR del aula** sin permiso abre el modal con **un solo botón "Continuar"** (sin "Ahora no" ni "Cerrar").
- [ ] Recién al tocar "Continuar" aparece el diálogo del sistema.
- [ ] Al denegar y volver, el modal **no vuelve a aparecer solo**: solo si tocás otra vez la función.

### Escáner con cuatro estados (RF-2) — 📸 ×4
- [ ] **Cargando** (se ve un instante al entrar) → `escaner-1-cargando.png`.
- [ ] **Concedido**: la cámara lee un QR (generá uno con el texto `AULA-12`) y completa el aula → `escaner-2-camara.png`.
- [ ] **Preguntable**: explicación + "Continuar" + campo para escribir el código → `escaner-3-preguntable.png`.
- [ ] **Bloqueado** (Android: denegar **dos** veces): pasos en Ajustes + "Abrir Ajustes" → `escaner-4-bloqueado.png`.
- [ ] Con la cámara denegada, escribir el código a mano completa el aula.

### Foto sin permiso de galería (RF-3) — 📸
- [ ] **Elegir de la galería** abre el selector **sin ningún diálogo de permiso** → `foto-selector.png`.
- [ ] **Sacar foto** pasa por la pantalla previa y luego abre la cámara.
- [ ] Con la cámara denegada, la pantalla ofrece la galería.

### Ubicación (RF-4) — 📸 ×2
- [ ] **Precisa**: muestra coordenadas → `ubicacion-concedida.png`.
- [ ] **Aproximada** (Android: elegir "Aproximada"; iOS: apagar "Precisa"): muestra **"Ubicación aproximada"**, sin coordenadas.
- [ ] **Denegada**: aviso + elegir sector a mano; el reporte se guarda igual → `ubicacion-denegada.png`.

### Notificaciones y avisos (RF-5) — 📸
- [ ] Ninguna pantalla pide notificaciones salvo el interruptor de **Ajustes de la app**.
- [ ] Activar el interruptor → pantalla previa → "Continuar" → diálogo del sistema.
- [ ] Con permiso: **Simular resolución** → salir de la app → a los **10 s** llega la notificación → `notificacion-recibida.png`.
- [ ] Sin permiso (o interruptor apagado): **Simular resolución** → el aviso aparece en el tab **Avisos**.

### Panel de permisos y volver de Ajustes (RF-9, RF-1) — 📸 ×2
- [ ] Cada tarjeta muestra estado, plataforma y `status` / `canAskAgain` / matices.
- [ ] Con un permiso bloqueado, captura del panel → `panel-antes.png`.
- [ ] "Abrir Ajustes" → habilitarlo → volver: el panel se actualiza **sin reiniciar** → `panel-despues.png`.
- [ ] Con ubicación aproximada, la tarjeta dice **Parcial** y `android.accuracy: 'coarse'` (o `ios.accuracy: 'reduced'`).

### La app nunca se bloquea (RF-7)
- [ ] Con **todos** los permisos denegados se crea un reporte completo (aula a mano, foto del selector, sector a mano) y el aviso llega a la bandeja.

---

## 3. Solo en la development build

- [ ] En Ajustes → Apps → **Mantenimiento IPF** → Permisos aparecen solo **Cámara, Ubicación y Notificaciones** (sin Micrófono ni Fotos y videos): `blockedPermissions` funcionó.
- [ ] Repetir el escáner y la ubicación con **nuestra** app (los diálogos ahora son de Mantenimiento IPF).
- [ ] 📸 **E-4**: captura del diálogo del sistema **con nuestro texto de propósito** → `dialogo-texto-proposito.png`.
  ⚠️ En **Android** el diálogo no tiene texto propio: esta captura solo se puede sacar en **iOS** (development build en iPhone o simulador). Si no hay acceso a iOS, se deja constancia en el README.

---

## 4. Resultado

Anotá acá lo que falle para corregirlo antes de cerrar la TASK 12:

| Paso | Qué pasó | Corregido |
|---|---|---|
| | | |
