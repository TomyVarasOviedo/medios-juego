import Confetti from "./confetti";
import { useEffect } from "react";

export default function PantallaFinal({ estado, jugarDeNuevo }) {
  const { nombres, puntos } = estado;
  const hayGanador = puntos.A !== puntos.B;
  useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, []);

  let mensaje;
  if (puntos.A === puntos.B) {
    mensaje = "¡Empate! Hace falta una ronda de desempate.";
  } else {
    const ganador = puntos.A > puntos.B ? nombres.A : nombres.B;
    mensaje = `${ganador} detectó más bulos.`;
  }
  const ganadorA = puntos.A >= puntos.B;
  const ganadorB = puntos.B >= puntos.A;

  return (
    <main className="final">
      <Confetti activo={hayGanador} />
      <p className="eyebrow">Resultado final</p>
      <h2 className="final__titulo">{mensaje}</h2>

      <div className="final__marcador">
        <div className={`final__equipo ${ganadorA ? "final__equipo--ganador-a" : ""}`}>
          <span className="final__nombre">{nombres.A}</span>
          <span className="final__puntos">{puntos.A}</span>
        </div>
        <span className="final__vs">vs</span>
        <div className={`final__equipo ${ganadorB ? "final__equipo--ganador-b" : ""}`}>
          <span className="final__nombre">{nombres.B}</span>
          <span className="final__puntos">{puntos.B}</span>
        </div>
      </div>

      <p className="final__cierre">
        Antes de compartir un titular, verificá la fuente, la fecha y quién lo firma.
      </p>

      <button type="button" className="boton boton--primario boton--grande" onClick={jugarDeNuevo}>
        Jugar de nuevo
      </button>
    </main>
  );
}
