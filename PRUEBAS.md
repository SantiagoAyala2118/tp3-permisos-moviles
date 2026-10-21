# PRUEBAS.md — Guía de pruebas manuales (TASK 12)

Recorrido para comprobar en el celular **cada requisito** de [spec.md](spec.md) y sacar, de paso, las capturas que pide el README (E-3). Marcá cada casilla a medida que la pruebes.

> 📸 = de ese paso sale una captura para el README. Guardalas en `docs/capturas/` con el nombre que se indica.

---

## 1. Preparación

### 1.1 Expo Go (prueba de la lógica)
1. Instalá **Expo Go** en el celular (Play Store / App Store).
2. En la PC, desde la carpeta del proyecto:
   ```bash
   npx expo start
   ```
3. Escaneá el QR con Expo Go (celular y PC en la misma red Wi-Fi; si no conecta, usá `npx expo start --tunnel`).

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
5. Levantar el servidor y abrir el proyecto desde la app **Mantenimiento IPF** instalada:
   ```bash
   npx expo start
   ```

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
