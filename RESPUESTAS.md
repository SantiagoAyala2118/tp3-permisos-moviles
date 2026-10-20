# RESPUESTAS — TP N° 3: Permisos móviles (Partes A a F)

**Alumno:** Santiago Ayala
**Materia:** Taller Complementario · React Native II — Instituto Politécnico Formosa
**Material usado:** presentación de clase "Permisos móviles" y guía oficial de Expo (docs.expo.dev/guides/permissions), Expo SDK 57.

## Índice

- [Parte A — ¿Qué es un permiso y por qué existe?](#parte-a--qué-es-un-permiso-y-por-qué-existe)
- [Parte B — Android: tipos de permisos y manifiesto](#parte-b--android-tipos-de-permisos-y-manifiesto)
- [Parte C — iOS: textos de propósito y acceso parcial](#parte-c--ios-textos-de-propósito-y-acceso-parcial)
- [Parte D — Expo: una API, dos plataformas](#parte-d--expo-una-api-dos-plataformas)
- [Parte E — Recetas: leer y corregir código](#parte-e--recetas-leer-y-corregir-código)
- [Parte F — Buenas prácticas y tiendas](#parte-f--buenas-prácticas-y-tiendas)

---

## Parte A — ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**

Un permiso es la autorización que la persona usuaria le da a una app para usar un recurso sensible del dispositivo, como la cámara, el micrófono, la ubicación, las fotos, los contactos o las notificaciones.

- **La app** declara qué recursos podría llegar a usar y, en el momento justo, pide acceso.
- **El sistema operativo** muestra el diálogo oficial, guarda la decisión y se encarga de que se cumpla.
- **La persona usuaria** decide: acepta, rechaza o da un acceso parcial. Además puede cambiar de idea cuando quiera desde Ajustes.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**

La sandbox es un espacio aislado en el que vive cada app: solo puede ver sus propios archivos y no puede tocar lo de otras apps ni lo del sistema. Para "salir de la caja" y usar algo sensible necesita una llave, y esa llave es el permiso, que solo puede dar la persona usuaria.

Sin ningún permiso, una app igual puede mostrar pantallas, guardar sus propios datos y conectarse a internet (en Android, `INTERNET` es un permiso normal que se concede solo al instalar).

**c) Las cuatro razones por las que existen los permisos, con un ejemplo de cada una**

| Razón | Qué significa | Ejemplo concreto |
|---|---|---|
| **Privacidad** | Tus datos (dónde estás, tus fotos, tu voz) no salen del dispositivo sin tu acuerdo. | Una app de linterna no puede leer mis fotos si yo no se lo permito. |
| **Seguridad** | Si se cuela una app maliciosa, el daño queda limitado a lo que se le permitió. | Un juego infectado que no tiene permiso de micrófono no puede grabar mis conversaciones. |
| **Transparencia** | El sistema muestra qué app está usando qué. | El puntito verde/naranja que aparece arriba de la pantalla cuando una app usa la cámara o el micrófono. |
| **Control** | La decisión no es para siempre: se revisa y se revoca desde Ajustes. | Le di la ubicación a una app de delivery y después se la saco desde Ajustes. |

**d) Analogía del portero del edificio**

- **La visita** es la app, que quiere subir a un departamento (por ejemplo, la cámara).
- **El portero** es el sistema operativo: no deja subir a nadie por su cuenta, primero llama al dueño.
- **El dueño del departamento** es la persona usuaria, que decide si deja pasar a la visita o no.

Que **"el portero se acuerda de la respuesta"** quiere decir que el sistema guarda la decisión. Si el dueño dijo que no, el portero no lo va a llamar cada vez que la visita insista (en iOS no lo vuelve a llamar nunca, y en Android solo una vez más). Si dijo que sí, la deja pasar sin volver a preguntar. Para cambiar esa decisión hay que ir a Ajustes.

### A2. Declarar y solicitar

| | Declarar (al compilar) | Solicitar (al ejecutar) |
|---|---|---|
| **¿Qué se hace?** | Se le avisa al sistema qué recursos **podría** usar la app. Queda escrito dentro del paquete que se instala. | Cuando la persona usa la función, el código pide acceso y el sistema muestra el diálogo. |
| **¿Dónde / cómo en Android?** | Una línea `<uses-permission android:name="android.permission.CAMERA" />` en el `AndroidManifest.xml`. | Solo para los permisos de **tiempo de ejecución** (cámara, ubicación, micrófono…). Los normales se conceden al instalar. |
| **¿Dónde / cómo en iOS?** | Un **texto de propósito** (`NS…UsageDescription`) en el `Info.plist`. | Para **cada** recurso protegido, la primera vez que se usa. |
| **¿Dónde / cómo en Expo?** | En `app.json` (o `app.config.ts`): los plugins de cada módulo, `android.permissions` e `ios.infoPlist`. Los archivos nativos se generan con `prebuild` o EAS Build. | Con `request…PermissionsAsync()` o con el hook del módulo (por ejemplo `useCameraPermissions()`). |
| **¿Qué pasa si se omite?** | Android deniega el permiso en el acto, **sin mostrar ningún diálogo**. En iOS el acceso falla o la app se cierra, y App Store Connect rechaza la build. | La app nunca obtiene el acceso: el permiso queda "sin decidir" y la función no anda. Si no lo declarás no lo podés pedir, y si no lo pedís no lo tenés. |

### A3. Verdadero o falso

| | V/F | Justificación (de las falsas) |
|---|---|---|
| a) El diálogo de permiso lo dibuja tu app con componentes de React Native. | **F** | El diálogo lo muestra el **sistema operativo**. Nuestro código solo elige cuándo pedirlo y qué hacer con la respuesta. |
| b) En Expo, la fuente de verdad de los permisos es `app.json` (o `app.config.ts`), no el `AndroidManifest.xml`. | **V** | — |
| c) Agregar un permiso nuevo en el `Info.plist` se puede publicar con una actualización OTA. | **F** | Las actualizaciones OTA solo cambian el código JavaScript. El `Info.plist` es nativo y va dentro del binario, así que hace falta una **build nueva**. |
| d) Si tu código pide un permiso que no está en el manifiesto, Android igual muestra el diálogo. | **F** | Android lo **deniega en el acto, sin mostrar ningún diálogo**. |
| e) El paquete `expo-permissions` es la forma recomendada de pedir permisos en SDK 57. | **F** | `expo-permissions` **ya no existe**. Cada módulo (`expo-camera`, `expo-location`…) trae sus propias funciones de permisos. |
| f) En iOS, las notificaciones no llevan texto de propósito en el `Info.plist`. | **V** | — |
| g) Con acceso limitado a fotos, `status` vale `'granted'` y el matiz está en `accessPrivileges`. | **V** | — |
| h) Desinstalar y reinstalar la app es la forma confiable de volver a "sin decidir" en las dos plataformas. | **V** | — |

### A4. Los estados de un permiso

**a) Diagrama de estados**

```
ANDROID (11+)
                     acepta
  Sin decidir ─────────────────────────────► Concedido
 (undetermined)  │                           (granted)
                 │ da acceso parcial ──────► Parcial (limited / aproximada)
                 │ rechaza
                 ▼
             Denegado ──── pide de nuevo y acepta ──► Concedido
    (denied, canAskAgain ✔)
                 │ rechaza otra vez
                 ▼
             Bloqueado ──── solo desde Ajustes ──► Concedido
    (denied, canAskAgain ✖)


iOS
                     acepta
  Sin decidir ─────────────────────────────► Concedido
 (undetermined)  │                           (granted)
                 │ da acceso parcial ──────► Parcial (limited / reducida)
                 │ rechaza (una vez alcanza)
                 ▼
             Bloqueado ──── solo desde Ajustes ──► Concedido
    (denied, canAskAgain ✖)
```

**Diferencia central:** Android da **dos oportunidades** (rechazo → denegado → bloqueado) y iOS da **una sola** (rechazo → bloqueado). Después, en las dos plataformas, solo se puede cambiar desde Ajustes.

**b) Qué devuelve Expo en cada estado**

| Estado | `status` | `canAskAgain` | ¿Puede aparecer el diálogo? |
|---|---|---|---|
| Sin decidir | `'undetermined'` | `true` | **Sí** |
| Concedido | `'granted'` | `true` | No hace falta: ya está concedido |
| Denegado (se puede volver a pedir) | `'denied'` | `true` | **Sí** (solo en Android: es la segunda oportunidad) |
| Bloqueado | `'denied'` | `false` | **No**: solo se cambia desde Ajustes |

---

## Parte B — Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
|---|---|---|
| `INTERNET` | De instalación (normal) | Alcanza con declararlo: se concede solo al instalar, sin diálogo. |
| `CAMERA` | Tiempo de ejecución | Declararlo y pedirlo con un diálogo cuando se usa la cámara. |
| `VIBRATE` | De instalación (normal) | Se concede al instalar. |
| `SYSTEM_ALERT_WINDOW` | Especial | No hay diálogo: la persona lo activa en Ajustes → "Mostrar sobre otras apps". |
| `POST_NOTIFICATIONS` | Tiempo de ejecución (desde Android 13) | Declararlo y pedirlo con un diálogo (con Expo, después de crear un canal). |
| `ACCESS_NETWORK_STATE` | De instalación (normal) | Se concede al instalar. |
| `READ_CONTACTS` | Tiempo de ejecución | Declararlo y pedirlo con un diálogo. |
| `SCHEDULE_EXACT_ALARM` | Especial | La persona lo habilita en Ajustes → "Alarmas y recordatorios". Desde Android 14 viene desactivado para la mayoría de las apps nuevas. |
| `RECORD_AUDIO` | Tiempo de ejecución | Declararlo y pedirlo con un diálogo (tiene la opción "Solo esta vez"). |
| `MANAGE_EXTERNAL_STORAGE` | Especial | La persona lo activa en Ajustes ("Acceso a todos los archivos"). Además Google Play lo restringe mucho. |

### B2. Grupos y nombres

**a)** Un grupo de permisos junta varios permisos técnicos relacionados bajo un mismo nombre que la persona entiende. La persona no ve nombres técnicos sino grupos como "Ubicación", "Cámara" o "Dispositivos cercanos". Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, la persona ve **un solo diálogo** de "Ubicación", en el que además puede elegir entre ubicación precisa o aproximada.

**b)** Todos los nombres completos llevan el prefijo **`android.permission.`**. El de la cámara es **`android.permission.CAMERA`**.

**c)** Los permisos de firma (*signature*) solo los obtienen las apps firmadas con el **mismo certificado** que el sistema o que la app que define el permiso. Sirven para que apps del mismo fabricante se comuniquen entre sí. Una app común no tiene esa firma, así que nunca podría obtenerlos.

### B3. Leé el manifiesto

**a)** Se concede solo al instalar: **`INTERNET`** (es normal). Además de declararlos, hay que pedirlos en tiempo de ejecución: **`CAMERA`**, **`ACCESS_COARSE_LOCATION`**, **`ACCESS_FINE_LOCATION`**, **`POST_NOTIFICATIONS`** y **`READ_EXTERNAL_STORAGE`** (este último solo en Android 12L o anterior). `RECORD_AUDIO` está quitado a propósito, así que la app no lo tiene.

**b)** `android:maxSdkVersion="32"` significa que el permiso solo se declara en dispositivos con **Android 12L (API 32) o anterior**. En versiones más nuevas ese permiso ya no existe para las fotos. Desde Android 13 lo reemplazan los permisos multimedia por tipo: **`READ_MEDIA_IMAGES`**, **`READ_MEDIA_VIDEO`** y **`READ_MEDIA_AUDIO`** (y en Android 14 se suma `READ_MEDIA_VISUAL_USER_SELECTED` para el acceso parcial).

**c)** `tools:node="remove"` **quita el permiso del manifiesto final**, aunque lo agregue una librería. Se genera con `blockedPermissions`:

```json
{
  "expo": {
    "android": {
      "blockedPermissions": ["android.permission.RECORD_AUDIO"]
    }
  }
}
```

**d)** En **`expo.android.permissions`**, que sirve para sumar permisos que ninguna librería declara:

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
    }
  }
}
```

**e)** No conviene editarlo a mano porque Expo **lo vuelve a generar en cada `prebuild`** a partir de `app.json`: cualquier cambio manual se pierde. La fuente de verdad es `app.json`. Y `blockedPermissions` **no funciona en Expo Go**: Expo Go es una app ya compilada con su propio manifiesto, así que solo tiene efecto en una build propia (development build o de producción).

### B4. Así pregunta Android

**a)** **No.** En Android el diálogo lo arma el sistema y no admite texto propio. Por eso la explicación hay que darla **antes de pedir**, dentro de la app, con una pantalla previa que cuente para qué se usa el permiso.

**b)**
- **"Mientras la app está en uso"**: el acceso se mantiene en el tiempo, pero solo mientras la app está en primer plano.
- **"Solo esta vez"** (Android 11+): vale mientras la app se está usando. Poco después de salir, el sistema lo revoca solo.
- "Solo esta vez" existe para **ubicación, cámara y micrófono**. El resto de los permisos muestra solo "Permitir" y "No permitir".

**c)** Si la persona toca "No permitir" dos veces, Android **deja de mostrar el diálogo** (equivale a "no volver a preguntar"). `canAskAgain` pasa a valer **`false`**, y la única salida es explicar y mandar a Ajustes.

**d)** La ubicación aproximada (unos 3 km²) sirve para mostrar **"farmacias de tu zona"** o el clima del barrio. No sirve para **llegar caminando a la puerta** de un lugar ni para que un repartidor encuentre tu casa.

**e)** Android **termina el proceso de la app**. Cuando la persona vuelve, la app arranca de cero.

### B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
|---|---|---|
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | El código tiene que contemplar que un permiso puede **no estar**: hay que pedirlo y manejar el "no". |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29) | Aparece `ACCESS_BACKGROUND_LOCATION`. En Expo se usa `requestBackgroundPermissionsAsync()`, **siempre después** del pedido de primer plano. |
| Dos rechazos equivalen a "no volver a preguntar" | Android 11 (API 30) | Después del segundo "no", `canAskAgain` pasa a `false`: la app tiene que ofrecer **Abrir Ajustes**. |
| Ubicación precisa o aproximada | Android 12 (API 31) | Hay que leer `permiso.android.accuracy` (`'fine'` o `'coarse'`) y hacer que la app funcione con las dos. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Hay que pedirlas con diálogo. Con `expo-notifications`, primero hay que crear el canal y pedirlas en un momento con sentido. |
| Acceso parcial a fotos y videos ("Seleccionar fotos") | Android 14 (API 34) | `accessPrivileges` puede valer `'limited'` también en Android: la app tiene que trabajar con la selección. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 (API 37). En Android 16 ya se podía probar de forma opcional. | Es un nuevo permiso de tiempo de ejecución, en el grupo "Dispositivos cercanos". Va a aplicar a las apps con target API 37, que llegan con los próximos SDK. |

**¿Qué es el `targetSdkVersion`?** Es la versión de Android para la que la app declara estar preparada. Muchas reglas nuevas solo se aplican si la app apunta a esa versión o a una más nueva.

**Expo SDK 57** apunta a **API 36** (Android 16). **Google Play** exige target **API 36** para apps nuevas y actualizaciones **desde el 31 de agosto de 2026**.

---

## Parte C — iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist

| Recurso | Clave en Info.plist |
|---|---|
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | **No lleva clave**: se piden directamente. |

### C2. Sin texto, no hay permiso

**a)** Si falta el texto de propósito y la app intenta usar la cámara, **la app se cierra (crash)** en ese momento. En la consola de Xcode aparece: *"This app has crashed because it attempted to access privacy-sensitive data without a usage description."* Además, al subir la build, **App Store Connect la rechaza** con el error **ITMS-90683: Missing purpose string in Info.plist**.

**b)** iOS muestra el diálogo **una sola vez**. Si la persona dice que no, la decisión queda guardada y solo se puede cambiar desde Ajustes. A la app le queda explicar para qué sirve el permiso, ofrecer un botón **"Abrir Ajustes"** (`Linking.openSettings()`) y, sobre todo, darle **un camino alternativo** para que pueda seguir usando la app.

**c)**
- **El sistema** arma el **título** con el nombre de la app (por ejemplo, *¿Permitir que "Farmacias Ya" use tu ubicación?*) y los botones. Eso no se puede cambiar.
- **Nosotros** escribimos el **texto de propósito**, que aparece debajo del título. Es la única oportunidad de convencer a la persona dentro del diálogo.
- En Expo se configura en `app.json`: en el **plugin de cada módulo** (por ejemplo `cameraPermission` en `expo-camera`) o en **`ios.infoPlist`**.

**d)** Pasa porque Apple revisa el binario: si el código compilado **referencia** una API protegida, exige su clave, aunque nuestra app nunca llegue a llamarla. Es común cuando una librería trae funciones que nosotros no usamos. Hay dos soluciones:
- **Agregar igual un texto de propósito** honesto para esa clave, con el plugin del módulo o con `ios.infoPlist` en `app.json`.
- **Sacar o configurar la librería** para que no incluya esa parte. Por ejemplo, algunos plugins aceptan `false` en el permiso que no se usa.

### C3. Probador de textos de propósito

Molde: **"Usamos tu [dato] para [beneficio concreto]"** (pauta 5.1.1: describir con claridad y por completo para qué se usa el dato).

| Texto propuesto | ¿Aprobado? | Versión mejorada |
|---|---|---|
| "Necesitamos tu ubicación." | **No**: no dice para qué se usa. | "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." |
| "Para mejorar tu experiencia." | **No**: es una frase comodín que serviría para cualquier app. No dice qué dato ni qué beneficio concreto da. | "Usamos tu ubicación para ordenar las farmacias por distancia y mostrarte primero las más cercanas." |
| "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." | **Sí**: dice qué dato, para qué y con qué beneficio, en el idioma de la persona. | — (se podría sumar transparencia: "…Solo mientras usás la app; no la guardamos.") |
| "La app no funciona sin ubicación." | **No**: suena a amenaza, no explica el beneficio y presiona a la persona (algo que la pauta 5.1.1(iv) no permite). | "Usamos tu ubicación para mostrarte las farmacias de turno de tu zona. Si preferís, podés buscar por barrio." |
| "Ubicación requerida por el sistema." | **No**: es falso (lo pide la app, no el sistema) y no explica nada. | "Usamos tu ubicación para indicarte cuál es la farmacia de turno más cerca de donde estás." |

### C4. Acceso parcial y gradual

| Caso | iOS | En Expo |
|---|---|---|
| Fotos limitadas ("Seleccionar fotos") | iOS 14 | `accessPrivileges: 'limited'` en la respuesta de `usePermissions()` de `expo-media-library` (o `useMediaLibraryPermissions()` de `expo-image-picker`). |
| Ubicación aproximada (interruptor "Precisa") | iOS 14 | `ios.accuracy: 'reduced'` en la respuesta de `expo-location` (`'full'` si es precisa). |
| "Permitir una vez" (ubicación) | iOS 13 | La respuesta es `granted`, pero **solo por esta sesión**: al volver a abrir la app vuelve a `undetermined`. Hay que volver a consultar con `getForegroundPermissionsAsync()`. |
| Ubicación escalonada: de "al usar la app" a "Siempre" | iOS 13 | Primero `requestForegroundPermissionsAsync()` y después, en un segundo pedido, `requestBackgroundPermissionsAsync()`. Se ve en `ios.scope` (`'whenInUse'` o `'always'`). |
| Notificaciones provisionales | iOS 12 | `Notifications.requestPermissionsAsync({ ios: { allowProvisional: true } })`. Se detectan con `ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL`. |
| Rastreo entre apps (App Tracking Transparency) | iOS 14.5 | Módulo `expo-tracking-transparency`: `useTrackingPermissions()` o `requestTrackingPermissionsAsync()`. |

**¿Qué versión mínima de iOS requiere Expo SDK 57?** **iOS 16.4.**

**Consecuencia práctica:** todo lo de la tabla existe desde antes de iOS 16.4, así que **cualquier persona que use la app puede encontrarse con todos estos casos**. No hace falta preguntar por la versión del sistema: siempre hay que diseñar la app para el acceso parcial (fotos limitadas, ubicación aproximada, permiso de una sola vez).

### C5. Android vs iOS, lado a lado

| | Android | iOS |
|---|---|---|
| **¿Dónde se declara?** | `<uses-permission>` en el `AndroidManifest.xml`. | Texto de propósito en el `Info.plist`. |
| **Texto en el diálogo** | Lo arma el sistema: no hay texto propio. | Lo escribimos nosotros (texto de propósito). |
| **Oportunidades para preguntar** | Dos: al segundo rechazo queda bloqueado (Android 11+). | Una sola. |
| **"Solo esta vez" / "Permitir una vez"** | Para ubicación, cámara y micrófono (Android 11+). | Solo para ubicación (iOS 13+). |
| **Notificaciones** | Permiso de tiempo de ejecución desde Android 13 (antes venían habilitadas). | Siempre se piden (o se usan las provisionales, que no muestran diálogo). |
| **Ubicación en segundo plano** | Permiso aparte que se concede desde Ajustes (Android 11+). | Segundo pedido para pasar de "al usar la app" a "Siempre". |
| **Si falta la declaración** | Se deniega sin mostrar diálogo. | El acceso falla o la app se cierra, y la tienda rechaza la build. |

---

## Parte D — Expo: una API, dos plataformas

### D1. Módulos y funciones

| Necesidad | Módulo | Hook / función de permiso |
|---|---|---|
| Escanear un QR con la cámara | `expo-camera` | `useCameraPermissions()` |
| Grabar video con sonido | `expo-camera` | `useCameraPermissions()` + `useMicrophonePermissions()` |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions()` (o `requestForegroundPermissionsAsync()`) |
| Seguir un envío con la app en segundo plano | `expo-location` (junto con `expo-task-manager`) | Primero `useForegroundPermissions()` y después `useBackgroundPermissions()` (o `requestBackgroundPermissionsAsync()`) |
| Mostrar un recordatorio | `expo-notifications` | `getPermissionsAsync()` / `requestPermissionsAsync()` |
| Grabar una nota de voz | `expo-audio` | `requestRecordingPermissionsAsync()` |
| Galería propia dentro de la app | `expo-media-library` | `usePermissions()` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `useTrackingPermissions()` (o `requestTrackingPermissionsAsync()`) |

**Un tutorial usa `import * as Permissions from 'expo-permissions'`. ¿Qué te dice eso?** Que el tutorial está **desactualizado**. El paquete `expo-permissions` ya no existe: hoy cada módulo maneja sus propios permisos.

### D2. Consultar, pedir y el hook

**a)**
- `get…PermissionsAsync()` **solo consulta** el estado actual. No muestra nada en pantalla.
- `request…PermissionsAsync()` **pide** el permiso: si todavía se puede preguntar, muestra el diálogo del sistema.
- **Solo `request…()` puede mostrar un diálogo.**

**b)** El hook devuelve `[permiso, pedirPermiso, consultarPermiso]`:
1. **`permiso`**: la respuesta actual (`status`, `granted`, `canAskAgain`…).
2. **`pedirPermiso`**: una función que llama a `request…()` y puede mostrar el diálogo.
3. **`consultarPermiso`**: una función que llama a `get…()` para volver a consultar sin mostrar nada.

En el primer render, `permiso` vale **`null`**, porque el hook todavía está consultando. Mientras tanto la pantalla tiene que mostrar un **indicador de carga**.

**c)** Si `canAskAgain` es `false`, `request…()` **vuelve al instante con `denied` y no muestra nada**. Si se lo llama en un bucle (por ejemplo, en cada render), la app queda pidiendo una y otra vez sin que la persona vea ningún diálogo: la pantalla se queda trabada en "Pidiendo permiso…" y se gasta batería. Lo correcto es detectar el bloqueo y ofrecer "Abrir Ajustes".

### D3. Leé la respuesta

| Respuesta | Qué hace la app |
|---|---|
| `null` | El hook todavía está consultando: mostrar un indicador de carga. |
| `{ status: 'granted', granted: true }` | Usar la función. |
| `{ status: 'undetermined', canAskAgain: true }` | Explicar el beneficio (pantalla previa) y ofrecer un botón "Continuar" que llame a pedir. |
| `{ status: 'denied', canAskAgain: true }` | Mostrar una alternativa y la opción de volver a intentarlo cuando la persona quiera, sin insistir. |
| `{ status: 'denied', canAskAgain: false }` | Explicar cómo habilitarlo y ofrecer "Abrir Ajustes" con `Linking.openSettings()`, además de la alternativa. |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Trabajar con las fotos que la persona eligió y ofrecer ampliar la selección, sin insistir. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Usar la ubicación como **aproximada**: mostrar resultados por zona y no distancias exactas. |

**Los dos campos que deciden casi todo:**
- **`granted`** responde **"¿lo uso?"**.
- **`canAskAgain`** responde **"¿lo pido o mando a Ajustes?"**.

### D4. Simulación del ciclo completo

**Android 14, app recién instalada, `expo-location`:**

| # | Acción | `status` | `canAskAgain` | ¿Diálogo? |
|---|---|---|---|---|
| 1 | `getForegroundPermissionsAsync()` | `undetermined` | `true` | No (solo consulta) |
| 2 | `requestForegroundPermissionsAsync()` → "No permitir" | `denied` | `true` | **Sí** |
| 3 | `requestForegroundPermissionsAsync()` → "No permitir" | `denied` | `false` | **Sí** (fue la segunda y última oportunidad) |
| 4 | `requestForegroundPermissionsAsync()` | `denied` | `false` | **No**: vuelve al instante |
| 5 | `Linking.openSettings()` → habilita "Mientras la app está en uso" → vuelve y la app consulta | `granted` | `true` | No |
| 6 | Igual que el 5, pero la app **no** vuelve a consultar | La app sigue mostrando lo último que sabía: `denied` / `false` | — | No. La pantalla queda **desactualizada** y sigue diciendo "bloqueado" aunque el permiso ya esté habilitado. |

**Pasos 1 a 4 en iOS:**

| # | `status` | `canAskAgain` | ¿Diálogo? |
|---|---|---|---|
| 1 | `undetermined` | `true` | No |
| 2 | `denied` | **`false`** | Sí |
| 3 | `denied` | `false` | **No** |
| 4 | `denied` | `false` | No |

El resultado **cambia en el paso 2**: en iOS **un solo rechazo alcanza** para quedar bloqueado, así que `canAskAgain` ya es `false`. En el paso 3 no aparece ningún diálogo (en Android todavía aparecía).

**"Permitir una vez" en iOS y después cerrar y reabrir la app:** durante esa sesión el estado es `granted`, pero al reabrir la app vuelve a **`undetermined`** y la app puede mostrar el diálogo otra vez.

### D5. Configurar app.json

App que lee QR sin grabar video, usa ubicación solo en primer plano para puntos de reciclaje y no debe tener `SYSTEM_ALERT_WINDOW`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para leer el código QR de los puntos de reciclaje.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos.",
          "isAndroidBackgroundLocationEnabled": false,
          "isIosBackgroundLocationEnabled": false
        }
      ]
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

- `microphonePermission: false` quita el texto del micrófono en iOS.
- `recordAudioAndroid: false` evita `RECORD_AUDIO` en Android (repetirlo en `blockedPermissions` es una seguridad extra por si otra librería lo agrega).
- No se pone `locationAlwaysAndWhenInUsePermission` y el segundo plano queda apagado.
- `SYSTEM_ALERT_WINDOW` viene en la plantilla nativa, y la única forma de sacarlo es `blockedPermissions`.

**¿Por qué `expo-camera` agrega `RECORD_AUDIO` en Android aunque la app no grabe sonido?** Porque `expo-camera` también sirve para **grabar video con sonido**, y por defecto deja el micrófono declarado (`recordAudioAndroid: true`) para que esa función ande sin configurar nada. Si la app no graba video con sonido, conviene apagarlo (mínimo privilegio).

### D6. Expo Go no es tu app

**a)** Porque **Expo Go es otra app ya compilada**, con su propio `Info.plist` y su propio manifiesto. Los diálogos que aparecen son los de Expo Go, no los nuestros. Nuestros textos de propósito recién se aplican cuando compilamos **nuestra** app (development build o build final).

**b)**
- **En Expo Go se puede probar la lógica:** estados del permiso, botones, ir a Ajustes, alternativas, cámara, ubicación en primer plano y **notificaciones locales**.
- **Necesita una development build:** ver nuestros textos de propósito y el manifiesto real (con `blockedPermissions`), las **notificaciones push en Android** (no están en Expo Go desde SDK 53) y la **ubicación en segundo plano** (Expo Go no la soporta en iOS ni tiene servicios en primer plano en Android).

**c)**

```bash
# Ver los archivos nativos generados (AndroidManifest.xml, Info.plist)
npx expo prebuild --clean

# Compilar e instalar una development build en Android (local)
npx expo run:android

# …o en la nube con EAS
npx eas-cli@latest build --profile development --platform android
```

**d)**
- **Android (adb):** `adb shell pm revoke <paquete> android.permission.ACCESS_FINE_LOCATION`. Si había quedado bloqueado, también hay que borrar las marcas de "no volver a preguntar": `adb shell pm clear-permission-flags <paquete> android.permission.ACCESS_FINE_LOCATION user-set user-fixed`.
- **Simulador de iOS:** `xcrun simctl privacy booted reset location <bundle id>` (con `reset all <bundle id>` se reinician todos los permisos de la app).

---

## Parte E — Recetas: leer y corregir código

### E1. Encontrá los errores (cámara)

**Errores del código original:**
1. **No contempla el estado "cargando":** en el primer render `permiso` vale `null`, así que `permiso.status` rompe la app (error *Cannot read property 'status' of null*).
2. **No contempla el estado "bloqueado":** si `canAskAgain` es `false`, el botón llama a `pedirPermiso`, que vuelve al instante sin mostrar nada. La persona toca y no pasa nada, porque falta el "Abrir Ajustes".
3. **El botón dice "Permitir":** tiene que decir **"Continuar"**, porque el permiso lo da el sistema y no nuestro botón.
4. **No vuelve a consultar al volver de Ajustes** (`useRevisarAlVolver`): la pantalla queda desactualizada.
5. Compara textos (`status === 'granted'`) cuando alcanza con `permiso.granted`.
6. **La cámara no lee QR:** a `CameraView` le faltan `barcodeScannerSettings` y `onBarcodeScanned`, así que muestra la imagen pero no completa nada.
7. **No hay alternativa** si la persona dice que no (escribir el código a mano). Además, `Explicacion` no está importado.

**Versión corregida con los cuatro estados (cargando → concedido → preguntable → bloqueado):**

```tsx
// src/app/escanear.tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Button, Linking, TextInput } from 'react-native';

import Cargando from '@/components/Cargando';
import Explicacion from '@/components/Explicacion';
import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver'; // hook de E5

export default function Escanear() {
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  useRevisarAlVolver(consultarPermiso); // se actualiza al volver de Ajustes

  const usarCodigo = (codigo: string) => {
    // guardar el código del aula y volver al formulario
    router.back();
  };

  // 1. Cargando: el hook todavía está consultando
  if (!permiso) return <Cargando />;

  // 2. Concedido: la cámara lee el QR
  if (permiso.granted) {
    return (
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => usarCodigo(data)}
      />
    );
  }

  // Alternativa para los dos casos sin cámara
  const campoManual = (
    <TextInput
      placeholder="O escribí el código del aula"
      onSubmitEditing={(e) => usarCodigo(e.nativeEvent.text)}
    />
  );

  // 3. Preguntable: explicación + "Continuar" (recién ahí aparece el diálogo)
  if (permiso.canAskAgain) {
    return (
      <Explicacion texto="Usamos la cámara para leer el QR del aula.">
        <Button title="Continuar" onPress={pedirPermiso} />
        {campoManual}
      </Explicacion>
    );
  }

  // 4. Bloqueado: solo se puede habilitar desde Ajustes
  return (
    <Explicacion texto="La cámara está desactivada para esta app. Podés habilitarla en Ajustes.">
      <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
      {campoManual}
    </Explicacion>
  );
}
```

### E2. El orden importa (ubicación)

**a)** Está al revés: pide **segundo plano antes que primer plano**. Las dos plataformas trabajan en forma escalonada: para tener "siempre" primero hay que tener "en uso".
- **En iOS**, el sistema primero pregunta "al usar la app", así que la persona nunca ve el pedido de "Siempre" con el contexto adecuado.
- **En Android 11+**, sin primer plano el segundo plano **simplemente no se obtiene** (y además ese pedido abre Ajustes en lugar de un diálogo). La función devuelve `false` y nunca llega a pedir el primer plano.

**b)**

```ts
import * as Location from 'expo-location';

export default async function activarSeguimiento() {
  // 1. Primero el primer plano
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  // 2. Después, y con una explicación previa, el segundo plano
  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

**c)**

```ts
import * as Location from 'expo-location';

export default async function obtenerUbicacion() {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) return null; // la app sigue: la persona elige a mano

  const aproximada =
    permiso.android?.accuracy === 'coarse' || // Android
    permiso.ios?.accuracy === 'reduced';      // iOS

  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitud: coords.latitude, longitud: coords.longitude, aproximada };
  } catch {
    return null; // GPS apagado o sin señal: tampoco rompe la app
  }
}
```

**d)** **No.** Para "farmacias cercanas" alcanza con primer plano, porque la persona las busca con la app abierta. Si se pidiera segundo plano, **Google Play exige una declaración especial de permisos**: hay que justificar el uso, mostrar un aviso visible dentro de la app y enviar un video que muestre la función. Si no se justifica, la app se rechaza.

### E3. Notificaciones mudas

**a)** La causa más probable es que **no hay ningún canal de notificaciones creado**: en Android 13+, Expo no muestra el diálogo hasta que exista al menos un canal. Antes de pedir el permiso hay que crear el canal con `Notifications.setNotificationChannelAsync('recordatorios', { name: 'Recordatorios', importance: Notifications.AndroidImportance.DEFAULT })`.

**b)** En **Android 12 o anterior**, las notificaciones vienen **habilitadas por defecto**: `requestPermissionsAsync()` responde concedido sin mostrar ningún diálogo.

**c)** Las **notificaciones provisionales**: se piden con `requestPermissionsAsync({ ios: { allowProvisional: true } })` y llegan en silencio al Centro de notificaciones, sin diálogo previo. Ese estado se detecta así:

```ts
const ajustes = await Notifications.getPermissionsAsync();
const esProvisional =
  ajustes.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
```

**d)** Conviene pedirlo **después de una acción con sentido**, cuando la persona entiende para qué sirve.
- **Buen momento:** cuando toca "Avisame cuando mi pedido esté listo" o activa "Recordarme el turno".
- **Mal momento:** apenas abre la app por primera vez, antes de que haya hecho nada.

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
|---|---|---|
| Elegir una foto de perfil | `ImagePicker.launchImageLibraryAsync` (selector del sistema) | Ninguno |
| Sacar una foto en el momento | `ImagePicker.launchCameraAsync` o `expo-camera` | Cámara |
| Editor que muestra toda la galería | `expo-media-library` | Fotos (completo o limitado) |
| Adjuntar la foto de un comprobante | `ImagePicker.launchImageLibraryAsync` (selector del sistema) | Ninguno |

**¿Por qué Google Play restringe `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO`?** Porque dan acceso a **todas** las fotos y videos de la persona, y la mayoría de las apps solo necesita una imagen puntual. Google Play solo los permite a apps cuya **función principal** necesita acceso amplio (galerías, editores). Desde el **28 de mayo de 2025**, el resto debe usar el **selector del sistema**.

**"El mejor permiso"** es **el que no tenés que pedir**: con el selector del sistema la persona elige y la app recibe solo esa imagen, sin ningún diálogo de permiso.

### E5. Volver de Ajustes

```ts
// src/hooks/useRevisarAlVolver.ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current !== 'active';   // venía de background/inactive
      if (estabaAfuera && nuevo === 'active') revisar();    // volvió al frente
      anterior.current = nuevo;
    });
    return () => sub.remove();                              // limpiar la suscripción
  }, [revisar]);
}
```

**a)** Porque los hooks de Expo **consultan el permiso solo al montarse** (o cuando se llama a pedir o consultar). Cuando mandamos a la persona a Ajustes, la app queda en segundo plano, y el cambio ocurre afuera, en otra app: nadie le avisa al hook. Hay que volver a consultar cuando la app regresa al frente.

**b)** La **tercera** función del hook: **`consultarPermiso`** (el `getPermission` de `useCameraPermissions()`), porque vuelve a leer el estado **sin mostrar ningún diálogo**:

```ts
const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
useRevisarAlVolver(consultarPermiso);
```

**c)** Porque el permiso **puede cambiar en cualquier momento sin que la app se entere**: la persona lo cambia en Ajustes, "Solo esta vez" se vence, Android quita permisos a las apps que no se usan hace meses y, si se revoca, Android reinicia la app. Un valor guardado "para siempre" queda viejo y la app mostraría información falsa. Lo correcto es **consultarlo** cada vez que hace falta.

---

## Parte F — Buenas prácticas y tiendas

### F1. Pedir en contexto

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
|---|---|---|
| Delivery – ubicación | Cuando la persona toca "Usar mi ubicación actual" al cargar la dirección de entrega. | Escribir la dirección a mano o buscar por barrio o código postal. |
| Billetera virtual – cámara | Cuando toca "Pagar con QR" o "Escanear". | Escribir a mano el código o el alias, o elegir una imagen del QR con el selector del sistema. |
| Red social – contactos | Cuando toca "Buscar amigos" o "Invitar contactos". | Compartir un enlace de invitación con el menú del sistema, o buscar por nombre de usuario. |
| Mensajería – micrófono | Cuando mantiene apretado el botón para grabar un audio por primera vez. | Escribir el mensaje en lugar de dictarlo. |
| Turnos médicos – notificaciones | Después de sacar un turno: "¿Querés que te recordemos el turno un día antes?". | Una bandeja de avisos dentro de la app (o agregar el turno al calendario). |
| Editor de fotos – galería completa | Cuando toca "Abrir mi galería" dentro del editor. | Trabajar con la selección limitada o elegir fotos sueltas con el selector del sistema. |

**¿Por qué pedir cuatro permisos apenas se abre la app "entrena el No permitir automático"?** Porque la persona todavía no hizo nada y no entiende para qué sirve cada permiso. Ve una cascada de diálogos seguidos, se cansa y empieza a tocar "No permitir" sin leer, casi por reflejo. Además, esos "no" quedan guardados (en iOS con uno alcanza para bloquear), así que después, cuando de verdad necesita la función, el permiso ya está bloqueado. En cambio, un pedido en contexto conecta el permiso con algo que la persona **acaba de querer hacer**.

### F2. La pantalla previa

**a)** Los tres elementos:
1. **El beneficio, en una frase:** lo mismo que dice el texto de propósito, con el tono de la app.
2. **Un solo botón: "Continuar"**, que lleva directo al diálogo del sistema.
3. **Transparencia:** aclarar que la decisión se puede cambiar cuando quiera en Ajustes, lo que baja la ansiedad.

**b)** Porque el permiso **lo da el sistema, no nuestro botón**. Si dijera "Permitir", la persona podría creer que ya lo concedió, y después aparecería otro diálogo pidiendo lo mismo, lo que confunde. "Continuar" es honesto: avisa que el paso siguiente es la pregunta del sistema.

**c)** La pauta 5.1.1(iv) dice que las apps deben **respetar la configuración de permisos** de la persona y **no manipular, engañar ni forzar** a dar acceso a datos innecesarios. También pide ofrecer alternativas (por ejemplo, cargar una dirección a mano). La guía de Apple pide **un único botón** que abra el diálogo y **ninguna forma de salir antes**, como "Ahora no" o "Cerrar". Apple rechaza las apps que ponen esos botones en la pantalla previa.

**d)** Si el permiso ya está bloqueado, el diálogo del sistema no va a aparecer. La pantalla cambia: **explica cómo habilitarlo** (los pasos en Ajustes) y el botón pasa a ser **"Abrir Ajustes"** (`Linking.openSettings()`).

### F3. Mínimo privilegio

**a) Puntos de reciclaje de tu barrio → ubicación aproximada.** Alcanza con saber la zona (unos 3 km²) para mostrar los puntos del barrio. No hace falta el punto exacto.

**b) Registrar una carrera con el celular en el bolsillo → "siempre" (segundo plano).** Con el celular en el bolsillo la pantalla se apaga y la app deja de estar al frente, y "en uso" no alcanza para seguir registrando el recorrido. Es justamente uno de los casos que justifican el segundo plano. Igual hay que pedirlo **escalonado**: primero "en uso", y después, con una explicación, "siempre".

**c) Subir la foto del DNI → selector del sistema.** Es una sola foto que la persona elige, así que no hace falta ningún permiso de galería. Además, Google Play exige el selector para este tipo de uso.

**d) Escanear el QR del aula → `expo-camera` sin micrófono.** Para leer un QR solo se necesita la imagen. Se configura `microphonePermission: false` (iOS) y `recordAudioAndroid: false` (Android).

### F4. Tiendas

**a)**
- **Google Play:**
  1. **Declaración de permisos sensibles:** la ubicación en segundo plano, por ejemplo, exige un aviso visible en la app y un video.
  2. **`READ_MEDIA_*` solo si es la función principal** de la app; el resto debe usar el selector.
  - Otros requisitos: completar la sección **Seguridad de los datos** y apuntar a **target API 36** desde el 31/08/2026.
- **App Store:**
  1. **Textos de propósito claros y completos** (pauta 5.1.1).
  2. **No forzar ni manipular** para conseguir el permiso (pauta 5.1.1(iv)).
  - Otros requisitos: las **etiquetas de privacidad** en App Store Connect y el **manifiesto de privacidad**.

**b)** El **manifiesto de privacidad** (`PrivacyInfo.xcprivacy`) es un archivo que Apple exige para declarar qué datos recolecta la app (y la de cada librería), para qué, y qué APIs "sensibles" usa y por qué motivo (por ejemplo, leer la fecha de los archivos o guardar preferencias). En Expo se configura en `app.json`, dentro de **`ios.privacyManifests`**.

**c)** **Android 17** suma el permiso de **red local** (`ACCESS_LOCAL_NETWORK`) y un **selector de contactos del sistema**, que permite elegir contactos sin pedir `READ_CONTACTS`. **Google Play** va a exigir ese selector a muchas de las apps que hoy piden `READ_CONTACTS`: será obligatorio **desde el 27/01/2027** para las apps con **target API 37**.

### F5. Errores comunes

| Situación | Causa | Solución |
|---|---|---|
| **a)** Xcode: *"This app has crashed because it attempted to access privacy-sensitive data without a usage description."* | Falta el **texto de propósito** (`NS…UsageDescription`) en el `Info.plist` para el recurso que se quiso usar. El mensaje sigue indicando qué clave falta. | Configurar el **plugin del módulo** (ej. `cameraPermission`) o `ios.infoPlist` en `app.json`, y **volver a compilar**. |
| **b)** "En Expo Go anda, en la build no": la cámara se deniega sin mostrar ningún diálogo. | Expo Go trae sus propios permisos. En nuestra build solo existe lo que declaramos en `app.json`: el permiso de cámara **no quedó declarado** (falta el plugin o quedó en `blockedPermissions`), y Android lo deniega en el acto. | Agregar el plugin `expo-camera` en `app.json`, revisar `blockedPermissions` y generar una **build nueva**. |
| **c)** Después de habilitar la ubicación en Ajustes, la app sigue diciendo "bloqueado". | La app **no vuelve a consultar** el permiso al volver de Ajustes: muestra un valor viejo. | Volver a consultar cuando la app regresa al frente, con `AppState` (el hook `useRevisarAlVolver(consultarPermiso)`). |
| **d)** La pantalla queda en "Pidiendo permiso…" para siempre porque el código llama a `request…()` en cada render. | Pedir en el render arma un **bucle**: cada respuesta vuelve a renderizar y vuelve a pedir. Con `canAskAgain: false`, además, el pedido vuelve al instante sin mostrar nada. | Pedir **solo cuando la persona toca un botón** ("Continuar"). En el render únicamente se **lee** el estado. Si `canAskAgain` es `false`, ofrecer "Abrir Ajustes". |
| **e)** Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones. | Trata un permiso **no esencial** como obligatorio y **bloquea la app entera**, algo que además va contra la pauta 5.1.1(iv). | Dejar usar la app igual y ofrecer una **alternativa**: una bandeja de avisos dentro de la app (o recordatorios por mail o en el calendario). Se puede volver a ofrecer el permiso cuando la persona saque un turno. |
