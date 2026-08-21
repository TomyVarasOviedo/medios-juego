function mezclar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function seleccionarTitulares(pool, cantidadVerdaderos, cantidadFalsos) {
  const verdaderos = mezclar(pool.filter((n) => !n.esFalso)).slice(0, cantidadVerdaderos);
  const falsos = mezclar(pool.filter((n) => n.esFalso)).slice(0, cantidadFalsos);
  return mezclar([...verdaderos, ...falsos]);
}

export function calcularPuntosRonda(seleccionesEquipo, titularesRonda, puntosPorAcierto) {
  return seleccionesEquipo.filter((id) =>
    titularesRonda.some((n) => n.id === id && n.esFalso)
  ).length * puntosPorAcierto;
}
