import { useEffect, useRef, useState } from "react";

export default function Temporizador({ segundosTotales, alFinalizar }) {
  const [restante, setRestante] = useState(segundosTotales);
  const finalizoRef = useRef(false);

  useEffect(() => {
    if (restante === 0) {
      if (!finalizoRef.current) {
        finalizoRef.current = true;
        alFinalizar();
      }
      return;
    }
    const id = setTimeout(() => setRestante((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [restante, alFinalizar]);

  const urgente = restante <= 10;
  const progreso = restante / segundosTotales;

  return (
    <div className={`temporizador ${urgente ? "temporizador--urgente" : ""}`}>
      <span className="temporizador__numero" aria-live="off">{restante}s</span>
      <div className="temporizador__barra" role="timer" aria-label={`${restante} segundos restantes`}>
        <div
          className="temporizador__llenado"
          style={{ transform: `scaleX(${progreso})`, backgroundColor: urgente ? "var(--color-rojo)" : "var(--color-acento)" }}
        />
      </div>
    </div>
  );
}
