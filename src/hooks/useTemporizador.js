import { useCallback, useRef, useState } from "react";

export function useTemporizador(segundosTotales) {
  const [restante, setRestante] = useState(segundosTotales);
  const finalizoRef = useRef(false);

  const reiniciar = useCallback(() => {
    finalizoRef.current = false;
    setRestante(segundosTotales);
  }, [segundosTotales]);

  const alLlegarACero = useCallback((callback) => {
    if (restante === 0 && !finalizoRef.current) {
      finalizoRef.current = true;
      callback();
    }
  }, [restante]);

  return { restante, reiniciar, alLlegarACero };
}
