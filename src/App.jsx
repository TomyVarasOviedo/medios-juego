import { useEffect, useState } from "react";
import { useJuego } from "./hooks/useJuego";
import PantallaInicio from "./components/PantallaInicio";
import PantallaExhibicion from "./components/PantallaExhibicion";
import PantallaSeleccion from "./components/PantallaSeleccion";
import PantallaRevelacion from "./components/PantallaRevelacion";
import PantallaFinal from "./components/PantallaFinal";
import PanelHost from "./components/PanelHost";
import Marcador from "./components/Marcador";

export default function App() {
  const juego = useJuego();
  const [modoPresentacion, setModoPresentacion] = useState(true);
  const { estado } = juego;

  useEffect(() => {
    function alTipear(e) {
      if (e.key.toLowerCase() === "h") {
        setModoPresentacion((m) => !m);
      }
      if (e.key === " " && estado.pantalla === "exhibicion") {
        e.preventDefault();
        juego.avanzarExhibicion();
      }
    }
    window.addEventListener("keydown", alTipear);
    return () => window.removeEventListener("keydown", alTipear);
  }, [estado.pantalla, juego]);

  return (
    <div className="app">
      {estado.pantalla !== "inicio" && (
        <header className="barra">
          <span className="barra__logo">¿REAL O FAKE?</span>
        
          <Marcador
            nombres={estado.nombres}
            puntos={estado.puntos}
            ganadosRonda={estado.ganadosRonda}
          />
        </header>
      )}

      {estado.pantalla === "inicio" && (
        <PantallaInicio alComenzar={juego.iniciarJuego} />
      )}
      {estado.pantalla === "exhibicion" && (
        <PantallaExhibicion estado={estado} avanzarExhibicion={juego.avanzarExhibicion} />
      )}
      {estado.pantalla === "seleccion" && (
        <PantallaSeleccion
          estado={estado}
          alternarSeleccion={juego.alternarSeleccion}
          confirmarYRevelar={juego.confirmarYRevelar}
        />
      )}
      {estado.pantalla === "revelacion" && (
        <PantallaRevelacion estado={estado} siguienteRonda={juego.siguienteRonda} />
      )}
      {estado.pantalla === "fin" && (
        <PantallaFinal estado={estado} jugarDeNuevo={juego.jugarDeNuevo} />
      )}

      {!modoPresentacion && (
        <>
          <PanelHost
            estado={estado}
            avanzarExhibicion={juego.avanzarExhibicion}
            confirmarYRevelar={juego.confirmarYRevelar}
            siguienteRonda={juego.siguienteRonda}
            corregirPuntaje={juego.corregirPuntaje}
            modoPresentacion={modoPresentacion}
            alternarModoPresentacion={() => setModoPresentacion(false)}
            jugarDeNuevo={juego.jugarDeNuevo}
          />
        </>
      )}

      {modoPresentacion && (
        <button
          type="button"
          className="boton boton--fantasma flotante"
          onClick={() => setModoPresentacion(false)}
        >
          Controles
        </button>
      )}
    </div>
  );
}
