export default function TarjetaTitular({ noticia, pie, urgente }) {
  const inicial = noticia.fuente.charAt(0).toUpperCase();

  return (
    <article className={`tarjeta ${urgente ? "tarjeta--urgente": ""}`}>
      <header className="tarjeta__cabecera">
        <span className="tarjeta__avatar" aria-hidden="true">{inicial}</span>
        <div className="tarjeta__meta">
          <span className="tarjeta__fuente">{noticia.fuente}</span>
        </div>
        <time className="tarjeta__fecha">{noticia.fecha}</time>
      </header>
      <h2 className={`tarjeta__titular ${urgente? "tarjeta-titular--urgente":""}`}>{noticia.titular}</h2>
      {pie}
    </article>
  );
}
