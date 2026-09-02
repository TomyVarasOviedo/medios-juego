import { useCallback, useState, useEffect } from "react";
import TarjetaTitular from "./TarjetaTitular";
import Temporizador from "./Temporizador";
import { TIEMPO_POR_TITULAR_SEGUNDOS } from "../config";

export default function PantallaExhibicion({ estado, avanzarExhibicion }) {
  const { titularesRonda, indiceExhibicion, rondaActual } = estado;
  const noticia = titularesRonda[indiceExhibicion];
  const [urgente, setUrgente] = useState(false);
  const manejarUrgencia = useCallback((v)=> setUrgente(v), []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto"});
  }, [indiceExhibicion, rondaActual]);

  return (
    <main className="exhibicion">
      <p className="eyebrow">
        Ronda {rondaActual} · Titular {indiceExhibicion + 1} de {titularesRonda.length}
      </p>
      <Temporizador
          key={`${rondaActual}-${indiceExhibicion}`}
          segundosTotales={TIEMPO_POR_TITULAR_SEGUNDOS}
          alFinalizar={avanzarExhibicion}
          onUrgencia={manejarUrgencia}
        />
      
      <TarjetaTitular key={noticia.id + "-" + indiceExhibicion} noticia={noticia} urgente={urgente} />

      <div className="exhibicion__pie">
        <div className="exhibicion__puntos">
          {titularesRonda.map((n, i) => (
            <span
              key={n.id}
              className={`punto ${i === indiceExhibicion ? "punto--actual" : ""}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <p className="exhibicion__consigna">
        Lean el titular. Discutan en equipo: ¿huele a fake? Recuerden cuál les genera sospecha.
      </p>
    </main>
  );
}
