export default function Marcador({ nombres, puntos, ganadosRonda, permitirCorregir, corregirPuntaje }) {
  return (
    <div className="marcador">
      {["A", "B"].map((equipo) => {
        const clase = equipo === "A" ? "marcador__equipo--a" : "marcador__equipo--b";
        return (
          <div key={equipo} className={`marcador__equipo ${clase}`}>
            <span className="marcador__nombre">{nombres[equipo]}</span>
            {ganadosRonda && (
              <span className="marcador__ronda">+{ganadosRonda[equipo]}</span>
            )}
            <span className="marcador__puntos">{puntos[equipo]}</span>
            {permitirCorregir && (
              <span className="marcador__correccion">
                <button
                  type="button"
                  onClick={() => corregirPuntaje(equipo, -1)}
                  aria-label={`Restar un punto a ${nombres[equipo]}`}
                >−</button>
                <button
                  type="button"
                  onClick={() => corregirPuntaje(equipo, +1)}
                  aria-label={`Sumar un punto a ${nombres[equipo]}`}
                >+</button>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
