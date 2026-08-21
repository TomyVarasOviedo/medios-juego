import { useCallback, useState } from "react";
import {
  CANTIDAD_POR_RONDA,
  MAX_SELECCIONES_POR_RONDA,
  PUNTOS_POR_RONDA,
  RONDAS,
} from "../config";
import { calcularPuntosRonda, seleccionarTitulares } from "../utils/seleccionarTitulares";
import noticias from "../data/noticias.json";

const estadoInicial = {
  pantalla: "inicio",
  nombres: { A: "Equipo 1", B: "Equipo 2" },
  puntos: { A: 0, B: 0 },
  ganadosRonda: null,
  rondaActual: 1,
  titularesRonda: [],
  indiceExhibicion: 0,
  selecciones: { A: [], B: [] },
};

export function useJuego() {
  const [estado, setEstado] = useState(estadoInicial);

  const iniciarJuego = useCallback((nombreA, nombreB) => {
    setEstado({
      ...estadoInicial,
      pantalla: "exhibicion",
      nombres: {
        A: nombreA.trim() || estadoInicial.nombres.A,
        B: nombreB.trim() || estadoInicial.nombres.B,
      },
      titularesRonda: seleccionarTitulares(
        noticias.rondas["1"],
        CANTIDAD_POR_RONDA.verdaderos[1],
        CANTIDAD_POR_RONDA.falsos[1]
      ),
    });
  }, []);

  const avanzarExhibicion = useCallback(() => {
    setEstado((prev) => {
      const siguienteIndice = prev.indiceExhibicion + 1;
      if (siguienteIndice >= prev.titularesRonda.length) {
        return { ...prev, pantalla: "seleccion", indiceExhibicion: 0 };
      }
      return { ...prev, indiceExhibicion: siguienteIndice };
    });
  }, []);

  const alternarSeleccion = useCallback((equipo, idTitular) => {
    setEstado((prev) => {
      const maximo = MAX_SELECCIONES_POR_RONDA[prev.rondaActual];
      const actuales = prev.selecciones[equipo];

      let nuevas;
      if (actuales.includes(idTitular)) {
        nuevas = actuales.filter((id) => id !== idTitular);
      } else {
        if (actuales.length >= maximo) return prev;
        nuevas = [...actuales, idTitular];
      }
      return { ...prev, selecciones: { ...prev.selecciones, [equipo]: nuevas } };
    });
  }, []);

  const confirmarYRevelar = useCallback(() => {
    setEstado((prev) => {
      const puntosPorAcierto = PUNTOS_POR_RONDA[prev.rondaActual];
      const ganados = {
        A: calcularPuntosRonda(prev.selecciones.A, prev.titularesRonda, puntosPorAcierto),
        B: calcularPuntosRonda(prev.selecciones.B, prev.titularesRonda, puntosPorAcierto),
      };
      return {
        ...prev,
        pantalla: "revelacion",
        ganadosRonda: ganados,
        puntos: {
          A: prev.puntos.A + ganados.A,
          B: prev.puntos.B + ganados.B,
        },
      };
    });
  }, []);

  const siguienteRonda = useCallback(() => {
    setEstado((prev) => {
      const esUltima = prev.rondaActual >= RONDAS[RONDAS.length - 1];
      if (esUltima) return { ...prev, pantalla: "fin" };

      const rondaSiguiente = prev.rondaActual + 1;
      return {
        ...prev,
        pantalla: "exhibicion",
        rondaActual: rondaSiguiente,
        titularesRonda: seleccionarTitulares(
          noticias.rondas[String(rondaSiguiente)],
          CANTIDAD_POR_RONDA.verdaderos[rondaSiguiente],
          CANTIDAD_POR_RONDA.falsos[rondaSiguiente]
        ),
        indiceExhibicion: 0,
        selecciones: { A: [], B: [] },
        ganadosRonda: null,
      };
    });
  }, []);

  const corregirPuntaje = useCallback((equipo, delta) => {
    setEstado((prev) => ({
      ...prev,
      puntos: { ...prev.puntos, [equipo]: Math.max(0, prev.puntos[equipo] + delta) },
    }));
  }, []);

  const jugarDeNuevo = useCallback(() => {
    setEstado(estadoInicial);
  }, []);

  return {
    estado,
    iniciarJuego,
    avanzarExhibicion,
    alternarSeleccion,
    confirmarYRevelar,
    siguienteRonda,
    corregirPuntaje,
    jugarDeNuevo,
  };
}
