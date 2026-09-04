import TarjetaTitular from "./TarjetaTitular";
import { PUNTOS_POR_RONDA } from "../config";

function VeredictoEquipo({ nombre, equipo, noticia, selecciones }) {
  const marco = selecciones[equipo].includes(noticia.id);
  const correcto = marco && noticia.esFalso;
  const falsoAlarma = marco && !noticia.esFalso;

  const estado = correcto ? "Acertó" : falsoAlarma ? "Marcó un titular real" : "No la marcó";
  const clase = correcto ? "veredicto--ok" : falsoAlarma ? "veredicto--error" : "";

  return (
    <span className={`veredicto ${clase}`}>
      <strong>{nombre}</strong> {estado}
    </span>
  );
}

export default function PantallaRevelacion({ estado, siguienteRonda }) {
  const { titularesRonda, selecciones, nombres, ganadosRonda, rondaActual } = estado;
  const esUltima = rondaActual === 3;

  return (
    <main className="revelacion">
      <div className="seleccion__lista">
        {titularesRonda.map((noticia) => (
          <TarjetaTitular
            key={noticia.id}
            noticia={noticia}
            pie={
              <footer className="tarjeta__veredictos">
                <span className={`sello ${noticia.esFalso ? "sello--falso" : "sello--real"}`}>
                  {noticia.esFalso ? "✗ FALSO" : "✓ REAL"}
                </span>
                {/* <VeredictoEquipo nombre={nombres.A} equipo="A" noticia={noticia} selecciones={selecciones} /> */}
                {/* <VeredictoEquipo nombre={nombres.B} equipo="B" noticia={noticia} selecciones={selecciones} /> */}
              </footer>
            }
          />
        ))}
      </div>

      {titularesRonda.filter((n) => n.esFalso).map((noticia) => (
        <p key={noticia.id} className="revelacion__explicacion">
          <strong>Por qué funciona “{recortar(noticia.titular)}”:</strong>{" "}
          {noticia.explicacion}
        </p>
      ))}

      <button type="button" className="boton boton--primario boton--grande" onClick={siguienteRonda}>
        {esUltima ? "Ver resultado final" : "Iniciar ronda siguiente"}
      </button>
    </main>
  );
}

function recortar(texto) {
  return texto.length > 48 ? texto.slice(0, 45) + "…" : texto;
}
