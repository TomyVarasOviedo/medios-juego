import { useState } from "react";

export default function PantallaInicio({ alComenzar }) {
  const [nombreA, setNombreA] = useState("Equipo 1");
  const [nombreB, setNombreB] = useState("Equipo 2");

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

      <ul className="inicio__reglas">
        <li><strong>Ronda 1:</strong> 2 titulares · 1 punto por acierto</li>
        <li><strong>Ronda 2:</strong> 4 titulares · 2 puntos por acierto</li>
        <li><strong>Ronda 3:</strong> 6 titulares · hasta 3 marcas por equipo · 3 puntos por acierto</li>
      </ul>
    </main>
  );
}
