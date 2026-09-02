import { useEffect, useState } from "react";
import TarjetaTitular from "./TarjetaTitular";

const noticiaEjemplo = {
  id: "tutorial-01",
  titular: "Científicos confirmaron que los gatos entienden perfectamente cuando les hablás de sus vacunas",
  esFalso: true,
  explicacion:
    "Este titular es falso: suena creíble, pero mezcla un dato real (los gatos) con una afirmación absurda que no tiene fuente verificable. Tu trabajo es detectar estas trampas.",
  fuente: "El Portal del Mito",
  fecha: "2026-09-01",
};

export default function PantallaInicio({ alComenzar }) {
  const [nombreA, setNombreA] = useState("Equipo 1");
  const [nombreB, setNombreB] = useState("Equipo 2");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    if (!modalAbierto) return;

    const previoOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function alTipear(e) {
      if (e.key === "Escape") setModalAbierto(false);
    }
    window.addEventListener("keydown", alTipear);

    return () => {
      document.body.style.overflow = previoOverflow;
      window.removeEventListener("keydown", alTipear);
    };
  }, [modalAbierto]);

  return (
    <main className="inicio">
      <h1 className="inicio__titulo">
        ¿Real o Fake<span className="inicio__signo">?</span>
      </h1>

      <form
        className="inicio__form"
        onSubmit={(e) => {
          e.preventDefault();
          alComenzar(nombreA, nombreB);
        }}
      >
        <div className="inicio__equipos">
          <label className="campo campo--a">
            <span>Nombre del Equipo 1</span>
            <input
              value={nombreA}
              onChange={(e) => setNombreA(e.target.value)}
              placeholder="Equipo 1"
              maxLength={24}
            />
          </label>
          <label className="campo campo--b">
            <span>Nombre del Equipo 2</span>
            <input
              value={nombreB}
              onChange={(e) => setNombreB(e.target.value)}
              placeholder="Equipo 2"
              maxLength={24}
            />
          </label>
        </div>
        <button type="submit" className="boton boton--primario boton--grande">
          Comenzar juego
        </button>
      </form>

      <button
        type="button"
        className="boton boton--fantasma inicio__tutorial"
        onClick={() => setModalAbierto(true)}
      >
        ¿Cómo se juega?
      </button>

      <ul className="inicio__reglas">
        <li><strong>Ronda 1:</strong> 2 titulares · 1 punto por acierto</li>
        <li><strong>Ronda 2:</strong> 4 titulares · 2 puntos por acierto</li>
        <li><strong>Ronda 3:</strong> 6 titulares · hasta 3 marcas por equipo · 3 puntos por acierto</li>
      </ul>

      {modalAbierto && (
        <div className="overlay" onClick={() => setModalAbierto(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Tutorial: cómo se juega"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal__encabezado">
              <h2 className="modal__titulo">Cómo se juega</h2>
              <button
                type="button"
                className="modal__cerrar"
                aria-label="Cerrar"
                onClick={() => setModalAbierto(false)}
              >
                ✕
              </button>
            </header>
            <TarjetaTitular
              noticia={noticiaEjemplo}
              pie={<p className="modal__explicacion">{noticiaEjemplo.explicacion}</p>}
            />
          </div>
        </div>
      )}
    </main>
  );
}
