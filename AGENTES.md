# AGENTES.md — Juego de Desinformación en TikTok

Documento de planificación técnica y de diseño para el juego interactivo de la
presentación sobre desinformación en TikTok. Sirve como guía de referencia
para el desarrollo (manual o asistido por un agente de código) y como fuente
de verdad sobre las reglas del juego.

---

## 1. Resumen del proyecto

Juego local, sin conexión a internet ni backend, pensado para ser proyectado
durante una presentación y controlado en vivo por el presentador (host) desde
una notebook. Dos equipos compiten identificando cuáles titulares de noticias
son falsos y cuáles son reales, aplicando los conceptos vistos en la charla
(señales de desinformación, patrones típicos de TikTok, etc.).

- **Stack**: React (Vite), sin backend, datos en JSON local.
- **Jugadores**: 2 equipos, nombres editables antes de empezar.
- **Rondas**: 3, con dificultad creciente.
- **Control**: una sola persona (el host/presentador) maneja todo desde teclado/mouse.
- **Salida visual**: pensada para proyector (pantalla completa, tipografía grande).

---

## 2. Objetivo pedagógico

El juego no busca "adivinar al azar", sino que los equipos apliquen,
discutiendo en voz alta, las señales de desinformación explicadas en la charla
(titulares sensacionalistas, fuentes dudosas, ausencia de datos verificables,
uso de emociones fuertes, etc.). El host puede usar cada revelación como
gancho para explicar por qué el titular falso "funciona" como desinformación.

---

## 3. Mecánica de juego

### 3.1 Estructura general

| Ronda | Titulares mostrados | Verdaderos | Falsos | Modo de selección | Puntos por acierto |
|-------|---------------------|------------|--------|--------------------|---------------------|
| 1     | 2                   | 1          | 1      | Selección simple (1 opción) | 1 pto por titular acertado |
| 2     | 4                   | 3          | 1      | Selección simple (1 opción) | 2 ptos por titular acertado |
| 3     | 6                   | 3          | 3      | Selección múltiple (hasta 3 opciones) | 3 ptos por titular acertado |

El juego se divide, dentro de cada ronda, en dos fases bien diferenciadas:

**Fase 1 — Exhibición cronometrada:**
- Se muestran **todos los titulares de la ronda, uno por uno**, cada uno
  durante un tiempo fijo en pantalla (por defecto **30 segundos**).
- Durante esta fase **no hay botones de respuesta visibles**: los equipos
  solo observan y discuten entre ellos, tomando nota mental (o en papel) de
  cuáles les generan sospecha.
- El tiempo por titular debe ser una **variable ajustable en el código**
  (no hardcodeada en múltiples lugares), por ejemplo una constante
  `TIEMPO_POR_TITULAR_SEGUNDOS = 30` en un archivo de configuración
  (`src/config.js`), para poder modificarla fácilmente antes de la
  presentación sin tocar la lógica del juego.
- El host puede tener un botón "Saltar tiempo" por si necesita avanzar el
  timer manualmente (por ejemplo, si el grupo ya terminó de leer).

**Fase 2 — Selección:**
- Una vez mostrados todos los titulares de la ronda, se pasa a la pantalla
  de selección: se listan nuevamente todos los titulares de esa ronda (sin
  temporizador) y cada equipo indica cuál/cuáles considera **falso(s)**.
- En **rondas 1 y 2**, cada equipo elige **una sola opción** (ya que hay un
  solo titular falso) — interfaz tipo selección única (radio buttons).
- En **ronda 3**, la interfaz cambia: cada equipo puede marcar **más de una
  opción** (hasta 3, ya que hay 3 titulares falsos) — interfaz tipo
  selección múltiple (checkboxes), con un contador visible de cuántas
  opciones lleva marcadas cada equipo.
- El host anota la selección final de cada equipo con un clic (o clicks, en
  ronda 3) sobre los titulares que el equipo indicó verbalmente.

**Revelación:**
- Después de registrar la selección de ambos equipos, se revela cuáles
  titulares eran realmente falsos, con su `explicacion` correspondiente
  (campo del JSON), que el host puede leer en voz alta.
- En ronda 3, la puntuación se calcula **por titular falso correctamente
  identificado** dentro de la selección de cada equipo (no es todo o nada):
  si un equipo marcó 2 de los 3 titulares falsos correctos, suma los puntos
  de esos 2 aciertos (ver sección 7 para el detalle de puntuación).
- Los puntos se acumulan ronda a ronda y se muestran en un marcador visible
  durante todo el juego.

### 3.2 Variante de "apuesta" (opcional, fácil de togglear)

Para la ronda 3 se puede habilitar un modo donde cada equipo, antes de
revelar, apuesta cuántos titulares creen tener bien (de 0 a 6) arriesgando
puntos extra. Lo dejo como *feature opcional* marcada en el roadmap, no es
parte del MVP.

### 3.3 Empates

Si al final hay empate, se sugiere una "ronda de desempate" con un titular
extra sorpresa (se puede reservar 1 titular "comodín" en el JSON con
`ronda: "desempate"`).

---

## 4. Estructura de datos (JSON local)

Archivo: `src/data/noticias.json`

```json
{
  "rondas": {
    "1": [
      {
        "id": "r1-01",
        "titular": "Texto del titular tal cual se mostraría en TikTok",
        "esFalso": false,
        "explicacion": "Por qué es verdadero/falso, fuente si corresponde, y qué señal de desinformación ilustra.",
        "fuente": "Nombre del medio o 'Cuenta viral de TikTok' si aplica",
        "fecha": "2024-03-10"
      }
    ],
    "2": [ /* 4 objetos: 3 esFalso:false, 1 esFalso:true */ ],
    "3": [ /* 6 objetos: 3 esFalso:false, 3 esFalso:true */ ],
    "desempate": [ /* 1 objeto opcional */ ]
  }
}
```

**Reglas de contenido:**
- Cada ronda debe tener el JSON pre-cargado con **más** titulares de los
  necesarios (un "pool"), y el sistema elige aleatoriamente cuáles usar
  respetando la proporción verdadero/falso de esa ronda. Esto te permite
  reutilizar el juego en distintas presentaciones sin repetir siempre los
  mismos titulares. Ejemplo: pool de 4 verdaderos y 4 falsos para la ronda 1,
  de los cuales el juego sortea 1 y 1.
- Todos los titulares falsos deben ser **verosímiles** (basados en patrones
  reales de desinformación viral), no absurdos, para que el juego sea
  desafiante.
- El campo `explicacion` es el corazón pedagógico: ahí va el dato que conecta
  con el contenido de la charla.

---

## 5. Arquitectura técnica

### 5.1 Stack

- **React + Vite** (create con `npm create vite@latest -- --template react`)
- Sin backend, sin base de datos: todo el estado vive en memoria de React
  (`useState` / `useReducer`) durante la sesión de juego.
- Sin necesidad de librerías de routing (es una sola sesión de juego,
  se maneja con estado de "pantalla actual").
- CSS: se puede usar CSS Modules o Tailwind, a elección; priorizar tipografía
  grande y alto contraste por el uso en proyector.

### 5.2 Estructura de carpetas sugerida

```
src/
  config.js                    // constantes ajustables (tiempos, puntos, etc.)
  data/
    noticias.json
  components/
    PantallaInicio.jsx        // configurar nombres de equipos, iniciar
    PantallaExhibicion.jsx    // muestra un titular con temporizador (fase 1)
    PantallaSeleccion.jsx     // lista de titulares + selección simple o múltiple (fase 2)
    TarjetaTitular.jsx        // un titular individual (uso en exhibición y selección)
    PanelHost.jsx             // controles del presentador (siguiente, revelar, corregir, saltar tiempo)
    Marcador.jsx              // puntaje de ambos equipos, visible siempre
    Temporizador.jsx          // barra/contador regresivo reutilizable
    PantallaRevelacion.jsx    // muestra si era verdadero/falso + explicación
    PantallaResultadoFinal.jsx
  hooks/
    useJuego.js                // lógica central: estado de ronda, fases, puntaje, selección aleatoria
    useTemporizador.js         // hook reutilizable de cuenta regresiva
  utils/
    seleccionarTitulares.js    // lógica de randomización respetando proporciones
  App.jsx
  main.jsx
```

**Archivo `src/config.js` (constantes ajustables):**

```js
export const TIEMPO_POR_TITULAR_SEGUNDOS = 30; // fase de exhibición
export const PUNTOS_POR_RONDA = { 1: 1, 2: 2, 3: 3 };
export const MAX_SELECCIONES_POR_RONDA = { 1: 1, 2: 1, 3: 3 }; // cuántos titulares puede marcar cada equipo
```

### 5.3 Lógica central (`useJuego`)

Estado sugerido:

```js
{
  equipoA: { nombre: "Equipo 1", puntos: 0 },
  equipoB: { nombre: "Equipo 2", puntos: 0 },
  rondaActual: 1,
  titularesRonda: [...],       // ya randomizados para esta partida
  indiceTitularExhibicion: 0,  // qué titular se está mostrando en la fase 1
  tiempoRestante: 30,          // cuenta regresiva del titular actual (fase 1)
  selecciones: {                // ids de titulares marcados como "falso" por cada equipo (fase 2)
    equipoA: [],                // ej: ["r3-04"] o ["r3-01", "r3-04", "r3-05"] en ronda 3
    equipoB: []
  },
  fase: "exhibicion"           // "exhibicion" | "seleccion" | "revelacion" | "resultados-ronda" | "fin"
}
```

Funciones clave: `iniciarJuego()`, `avanzarExhibicion()` (pasa al siguiente
titular o, al llegar al final, cambia la fase a `"seleccion"`),
`alternarSeleccion(equipo, idTitular)` (agrega/quita un titular de la
selección de un equipo, respetando el máximo de `MAX_SELECCIONES_POR_RONDA`
definido en `config.js`), `revelar()`, `siguienteRonda()`,
`corregirPuntaje()` (por si el host se equivoca al anotar).

### 5.4 Randomización (`seleccionarTitulares.js`)

Dado el pool de una ronda y la proporción requerida (ej. 1 falso / 1
verdadero), la función debe:
1. Filtrar por `esFalso: true` y `esFalso: false`.
2. Elegir aleatoriamente la cantidad necesaria de cada grupo.
3. Mezclar (shuffle) el orden final de presentación.

Usar una función simple de shuffle (Fisher-Yates) para evitar sesgos.

---

## 6. Flujo de pantallas

### 6.1 Pantalla de inicio
- Input para nombre de Equipo 1 y Equipo 2 (con valores por defecto).
- Botón "Comenzar juego".
- Opcional: breve resumen de reglas en pantalla (para mostrar al público antes de arrancar).

### 6.2 Pantalla de exhibición (fase 1, `fase === "exhibicion"`)
- Indicador de ronda actual (ej. "Ronda 2 de 3").
- Marcador de puntos siempre visible (arriba o costado).
- Titular grande y centrado, **sin indicar** si es verdadero o falso.
- Temporizador visible (ej. barra de progreso o número regresivo) que cuenta
  desde `TIEMPO_POR_TITULAR_SEGUNDOS` (definido en `config.js`) hasta 0.
- Al llegar a 0 (o al apretar "Saltar tiempo" el host), avanza automáticamente
  al siguiente titular de la ronda.
- Indicador de progreso dentro de la ronda (ej. "Titular 2 de 4") para que el
  público sepa cuántos faltan.
- Al mostrarse el último titular de la ronda, al finalizar su tiempo se pasa
  automáticamente a la Pantalla de selección (fase 2).

### 6.3 Pantalla de selección (fase 2, `fase === "seleccion"`)
- Se listan **todos los titulares de la ronda ya mostrados**, ahora sin
  temporizador, para que los equipos elijan cuál(es) creen falso(s).
- **Rondas 1 y 2**: interfaz de selección única — el host marca, por cada
  equipo, un solo titular de la lista (ej. con radio buttons o resaltando la
  tarjeta elegida).
- **Ronda 3 (interfaz distinta)**: interfaz de selección múltiple — el host
  puede marcar hasta 3 titulares por equipo (checkboxes), con un contador
  visible ("Equipo 1: 2/3 seleccionados") para que quede claro cuántas
  opciones lleva marcadas cada equipo y evitar pasarse del máximo
  (`MAX_SELECCIONES_POR_RONDA`, definido en `config.js`).
- Botón "Confirmar selecciones y revelar" habilitado recién cuando ambos
  equipos completaron su elección (o el host decide forzar el avance).

### 6.4 Panel de control del host (misma app, sección separada o vista dual)
Dos enfoques posibles — elegir uno para el MVP:

- **Opción A (recomendada para simplicidad)**: una sola pantalla, dividida en
  dos zonas: arriba lo que ve el público (titular/temporizador en fase 1,
  lista de selección en fase 2, marcador), abajo una franja de controles
  solo para el host (en fase 1: "Saltar tiempo"; en fase 2: marcar la
  selección de cada equipo, "Revelar respuesta", "Siguiente"). Funciona bien
  si proyectás la pantalla completa de la laptop.
- **Opción B (más compleja)**: ventana separada de control usando
  `BroadcastChannel` API o `localStorage` events para sincronizar dos pestañas
  del navegador (una en el proyector, otra en tu notebook). Dejar como mejora
  futura, no para el MVP.

Para el MVP se sugiere **Opción A**, ocultando la franja de controles del
host con un toggle ("modo presentación") por si se quiere ocultar de golpe
para una foto/captura, pero sin complejizar con multi-ventana.

### 6.5 Pantalla de revelación
- Muestra, para cada titular de la ronda, si era VERDADERO o FALSO con color
  (verde/rojo) y un ícono grande.
- Muestra qué seleccionó cada equipo (correcto ✅ / incorrecto ❌ / no
  marcado), incluyendo en ronda 3 el detalle de cuántos de los falsos
  acertó cada equipo.
- Muestra el texto de `explicacion` de cada titular falso.
- Botón "Siguiente" para continuar.

### 6.6 Pantalla de resultado de ronda
- Resumen de puntos ganados en esa ronda por cada equipo.
- Botón "Iniciar ronda siguiente".

### 6.7 Pantalla final
- Marcador final, equipo ganador destacado.
- Opción de "Jugar de nuevo" (resetea puntaje, vuelve a randomizar titulares).

---

## 7. Sistema de puntuación

- 1 punto por titular falso correctamente identificado en ronda 1, 2 en
  ronda 2, 3 en ronda 3 (ver tabla en sección 3.1). Ajustable fácilmente vía
  la constante `PUNTOS_POR_RONDA` en `config.js`.
- En rondas 1 y 2, como cada equipo elige un solo titular, el puntaje de la
  ronda es simplemente "acertó" o "no acertó" (0 o `PUNTOS_POR_RONDA[ronda]`).
- En ronda 3, al ser selección múltiple, el puntaje se calcula **por cada
  titular falso que el equipo haya marcado dentro de su selección**: si
  identificó 2 de los 3 falsos, suma 2 × `PUNTOS_POR_RONDA[3]`. Marcar un
  titular verdadero por error no resta puntos en el MVP (se puede agregar
  penalización como mejora opcional, ver sección 8).
- Ambos equipos pueden acertar el mismo titular (no es exclusión mutua).
- El host tiene botón de "corregir" por si anota mal en vivo.

---

## 8. Roadmap de implementación (checklist)

**MVP (necesario para la presentación):**
- [ ] Setup del proyecto Vite + React
- [ ] `noticias.json` con pool de titulares para las 3 rondas (redactar contenido real)
- [ ] Archivo `config.js` con constantes ajustables (tiempo por titular, puntos, máximo de selecciones)
- [ ] Hook `useJuego` con toda la lógica de estado (fases exhibición/selección/revelación)
- [ ] Hook `useTemporizador` reutilizable para la cuenta regresiva de 30 segundos
- [ ] Función de randomización con proporciones correctas por ronda
- [ ] Pantalla de inicio (nombres de equipos)
- [ ] Pantalla de exhibición cronometrada (fase 1)
- [ ] Pantalla de selección — simple en rondas 1 y 2, múltiple en ronda 3 (fase 2)
- [ ] Panel de control del host (Opción A)
- [ ] Pantalla de revelación con explicación
- [ ] Marcador persistente en pantalla
- [ ] Pantalla de resultado final
- [ ] Ajustes de estilo para proyector (tamaño de fuente, contraste)

**Mejoras opcionales (post-MVP):**
- [ ] Modo apuesta en ronda 3
- [ ] Penalización por marcar un titular verdadero como falso en ronda 3
- [ ] Ronda de desempate
- [ ] Animaciones de transición entre pantallas
- [ ] Sonidos (correcto/incorrecto/tic-tac/alarma de fin de tiempo)
- [ ] Modo dos ventanas sincronizadas (host + proyección) vía BroadcastChannel
- [ ] Exportar resultados finales a PDF/imagen para compartir después

---

## 9. Contenido pendiente (a completar por vos)

- [ ] Nombre del juego
- [ ] Nombres/temática de los equipos (o dejar editable en pantalla de inicio)
- [ ] Redactar los pools de titulares reales y falsos para cada ronda, con
      sus explicaciones — este es el contenido más importante y el que más
      tiempo de investigación va a llevar. Sugerencia: usar casos reales de
      desinformación viral en TikTok relacionados con el eje temático de la
      charla, para que conecten directamente con el contenido presentado.
- [ ] Paleta de colores / identidad visual acorde a la presentación general
