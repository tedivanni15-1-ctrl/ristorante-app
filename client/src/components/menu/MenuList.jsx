import { deactivateMenuItem } from "../../api/menu.api.js";

export default function MenuList({ piatti, onRefresh, onEdit }) {
  if (!piatti.length) {
    return (
      <div className="empty">
        <div className="empty__icon">🍽</div>
        <p>Nessun piatto nel menu. Aggiungine uno!</p>
      </div>
    );
  }

  // Raggruppa per categoria
  const gruppi = piatti.reduce((acc, p) => {
    const cat = p.categoria || "Senza categoria";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  async function handleDisattiva(id) {
    if (!confirm("Disattivare questo piatto dal menu?")) return;
    try {
      await deactivateMenuItem(id);
      onRefresh?.();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      {Object.entries(gruppi).map(([cat, lista]) => (
        <div key={cat}>
          <h3 className="section-title">{cat}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
            {lista.map((p) => (
              <div key={p.id} className="menu-item">
                <div className="menu-item__info">
                  <div className="menu-item__nome">{p.nome}</div>
                  {p.descrizione && (
                    <div className="menu-item__desc">{p.descrizione}</div>
                  )}
                </div>
                <div className="menu-item__price">€ {Number(p.prezzo).toFixed(2)}</div>
                <div className="menu-item__actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit?.(p)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDisattiva(p.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
