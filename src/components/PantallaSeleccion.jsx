import TarjetaTitular from "./TarjetaTitular";
import { MAX_SELECCIONES_POR_RONDA } from "../config";

export default function PantallaSeleccion({ estado, alternarSeleccion, confirmarYRevelar }) {
  const { titularesRonda, selecciones, nombres, rondaActual } = estado;
  const maximo = MAX_SELECCIONES_POR_RONDA[rondaActual];

  const completoA = selecciones.A.length >= maximo;
  const completoB = selecciones.B.length >= maximo;
  const puedeConfirmar = completoA && completoB;

  return (
    <main className="seleccion">
      <header className="seleccion__encabezado">
        <h2 className="seleccion__titulo">¿Cuáles son fake?</h2>
        <p className="seleccion__ayuda">
          Marquen la selección de cada equipo. Cada equipo puede marcar{" "}
          {maximo === 1 ? "un titular" : `hasta ${maximo} titulares`}.
        </p>
        <div className="seleccion__contadores">
          {["A", "B"].map((equipo) => (
            <span
              key={equipo}
              className={`contador contador--${equipo.toLowerCase()} ${
                (equipo === "A" ? completoA : completoB) ? "contador--completo" : ""
              }`}
            >
              {nombres[equipo]}: {selecciones[equipo].length}/{maximo}
            </span>
          ))}
        </div>
      </header>

      <div className="seleccion__lista">
        {titularesRonda.map((noticia) => (
          <TarjetaTitular
            key={noticia.id}
            noticia={noticia}
            pie={
              <footer className="tarjeta__eleccion">
                {["A", "B"].map((equipo) => {
                  const marcado = selecciones[equipo].includes(noticia.id);
                  return (
                    <button
                      key={equipo}
                      type="button"
                      className={`boton-equipo boton-equipo--${equipo.toLowerCase()} ${marcado ? "boton-equipo--marcado" : ""}`}
                      onClick={() => alternarSeleccion(equipo, noticia.id)}
                      aria-pressed={marcado}
                    >
                      {marcado ? "✓ " : ""}{nombres[equipo]}
                    </button>
                  );
                })}
              </footer>
            }
          />
        ))}
      </div>

      <div className="seleccion__acciones">
        <button
          type="button"
          className="boton boton--primario"
          onClick={confirmarYRevelar}
          disabled={!puedeConfirmar}
        >
          Confirmar selecciones y revelar
        </button>
        {!puedeConfirmar && (
          <p className="seleccion__pendiente">Falta completar la selección de un equipo.</p>
        )}
      </div>
    </main>
  );
}
