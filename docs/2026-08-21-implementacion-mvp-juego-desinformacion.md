# Minuta — 2026-08-21: Implementación MVP del juego de desinformación

Proyecto: juego "¿Real o Fake?" (desinformación en TikTok) según plan en `AGENTES.md`.

## Lo implementado

### Setup y arquitectura
- Proyecto **React + Vite** desde cero (`package.json`, `vite.config.js`, `index.html`).
- Estructura de carpetas según AGENTES.md: `src/config.js`, `data/`, `components/`, `hooks/`, `utils/`, `styles/`.

### Lógica de juego
- `useJuego.js`: estado central (fases inicio/exhibición/selección/revelación/fin, puntajes, selecciones por equipo).
- `useTemporizador.js` + componente `Temporizador`: cuenta regresiva de 30s por titular con auto-avance.
- `seleccionarTitulares.js`: randomización Fisher-Yates respetando proporciones V/F por ronda. Verificada en 50 iteraciones por ronda.
- Sistema de puntuación: 1/2/3 puntos por falso acertado según ronda; corrección manual (+/−) para el host.

### Componentes
- Pantallas: Inicio, Exhibición, Selección, Revelación, Final.
- Soporte: `TarjetaTitular`, `Marcador`, `PanelHost`, `Temporizador`.

### Controles del host
- Botones contextuales: saltar tiempo, revelar ahora, iniciar ronda siguiente.
- Tecla `Espacio` avanza titular; tecla `H` alterna modo presentación (oculta controles).
- Modo presentación con botón flotante para recuperar los controles.

### Datos de prueba
- `src/data/noticias.json` con pools sobrecargados (4+5+8 titulares + desempate), cada uno con `explicacion`, `fuente` y `fecha`.

### Diseño visual
- Paleta **TokyoNight** modular: todas las variables viven en `src/styles/tokens.css`; cambiar de tema = reemplazar solo ese archivo.
- Tipografías: Anton (titulares/display), Instrument Sans (cuerpo), JetBrains Mono (datos/tiempos).
- Elemento distintivo: tarjeta de titular estilo post de TikTok proyectado con barra de tiempo que se pone roja pulsante a los 10s.
- Calidad base: responsive, foco visible, `prefers-reduced-motion` respetado.

### Correcciones
- Import faltante de `Marcador` en `PanelHost.jsx` (error en runtime).
- Favicon SVG inline para eliminar el 404.

## Lo que falta implementar

Contenido:
- [ ] Reemplazar titulares de prueba por casos reales investigados (sección 9 del AGENTES.md).
- [ ] Definir nombre definitivo del juego y nombres de equipos temáticos.

Funcionalidad (roadmap AGENTES.md):
- [ ] Ronda de desempate automática en caso de empate (el JSON ya tiene la entrada).
- [ ] Modo apuesta en ronda 3.
- [ ] Penalización por marcar un titular real como falso.
- [ ] Sonidos (tic-tac, correcto/incorrecto).
- [ ] Modo dos ventanas sincronizadas (host + proyector vía BroadcastChannel).
- [ ] Animaciones de transición entre pantallas.
- [ ] Exportar resultados finales a PDF/imagen.
