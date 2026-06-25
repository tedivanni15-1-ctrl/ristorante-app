import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenu } from "../api/menu.api.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function HomeCliente() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu().then(setMenu).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categorie = [...new Set(menu.map((p) => p.categoria_id))];

  return (
    <div>
      <div className="page-header" style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>
          🍽 Benvenuto alla Trattoria
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Prenota un tavolo, scopri il menu, lasciaci un feedback
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2rem" }}>
        <button className="btn btn-primary" onClick={() => navigate("/prenotazioni")}>
          📅 Prenota un tavolo
        </button>
        <button className="btn btn-ghost" onClick={() => navigate("/menu")}>
          🍽 Sfoglia il menu
        </button>
        <button className="btn btn-ghost" onClick={() => navigate("/feedback")}>
          ⭐ Lascia un feedback
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "1rem", color: "var(--color-primary)" }}>
          Il nostro Menu
        </h2>
        {loading ? <Spinner /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {menu.filter(p => p.is_active).slice(0, 6).map((piatto) => (
              <div key={piatto.id} className="card" style={{ margin: 0 }}>
                <div style={{ fontWeight: 600 }}>{piatto.nome}</div>
                {piatto.descrizione && (
                  <div style={{ fontSize: ".85rem", color: "var(--color-text-muted)", margin: ".25rem 0" }}>
                    {piatto.descrizione}
                  </div>
                )}
                <div style={{ color: "var(--color-primary)", fontWeight: 700, marginTop: ".5rem" }}>
                  €{Number(piatto.prezzo).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
        {menu.length > 6 && (
          <button className="btn btn-ghost" style={{ marginTop: "1rem" }} onClick={() => navigate("/menu")}>
            Vedi tutto il menu →
          </button>
        )}
      </div>
    </div>
  );
}
