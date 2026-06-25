import Badge from "../ui/Badge.jsx";

export default function TavoliGrid({ tavoli, onSelect }) {
  if (!tavoli.length) {
    return (
      <div className="empty">
        <div className="empty__icon">🪑</div>
        <p>Nessun tavolo trovato.</p>
      </div>
    );
  }

  return (
    <div className="grid-3">
      {tavoli.map((t) => (
        <div
          key={t.id}
          className="tavolo-card"
          onClick={() => onSelect?.(t)}
          style={{ cursor: onSelect ? "pointer" : "default" }}
        >
          <div className="tavolo-card__num">T{t.numero}</div>
          <div className="tavolo-card__cap">👤 {t.capienza} posti</div>
          <div>
            <Badge stato={t.stato} />
          </div>
          {onSelect && (
            <button className="btn btn-primary btn-sm btn-full" style={{ marginTop: ".25rem" }}>
              Seleziona
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
