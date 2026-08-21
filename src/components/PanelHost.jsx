import Marcador from "./Marcador";

export default function PanelHost({
  estado,
  avanzarExhibicion,
  confirmarYRevelar,
  siguienteRonda,
  corregirPuntaje,
  modoPresentacion,
  alternarModoPresentacion,
  jugarDeNuevo,
}) {
  const { pantalla } = estado;
  if (pantalla === "inicio") return null;

  return (
    <footer className="host">
      <div className="host__zona">
        {pantalla === "exhibicion" && (
          <button type="button" className="boton" onClick={avanzarExhibicion}>
            Saltar tiempo / Siguiente titular
          </button>
        )}
        {pantalla === "seleccion" && (
          <button
            type="button"
            className="boton"
            onClick={confirmarYRevelar}
          >
            Revelar ahora
          </button>
        )}
        {pantalla === "revelacion" && (
          <button type="button" className="boton" onClick={siguienteRonda}>
            {estado.rondaActual === 3 ? "Ver resultado final" : "Iniciar ronda siguiente"}
          </button>
        )}

        {pantalla !== "fin" && (
          <Marcador
            nombres={estado.nombres}
            puntos={estado.puntos}
            permitirCorregir
            corregirPuntaje={corregirPuntaje}
          />
        )}
      </div>

      <div className="host__zona host__zona--secundaria">
        <button
          type="button"
          className="boton boton--fantasma"
          onClick={jugarDeNuevo}
        >
          Reiniciar juego
        </button>
        <label className="interruptor">
          <input type="checkbox" checked={!modoPresentacion} onChange={alternarModoPresentacion} />
          Mostrar controles (tecla H)
        </label>
      </div>
    </footer>
  );
}
