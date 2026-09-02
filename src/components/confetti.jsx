import { useEffect } from "react";
import confetti from "canvas-confetti";

const COLORES_TOKYO_NIGHT = [
  "#7aa2f7",
  "#bb9af7",
  "#9ece6a",
  "#f7768e",
  "#ff9e64",
  "#7dcfff",
];

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function lanzarFuegosArtificiales() {
  const duracion = 5000;
  const finAnimacion = Date.now() + duracion;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 100,
    colors: COLORES_TOKYO_NIGHT,
  };

  const interval = window.setInterval(() => {
    const tiempoRestante = finAnimacion - Date.now();

    if (tiempoRestante <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (tiempoRestante / duracion);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

export default function Confetti({ activo }) {
  useEffect(() => {
    if (!activo) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lanzarFuegosArtificiales();
  }, [activo]);

  return null;
}
