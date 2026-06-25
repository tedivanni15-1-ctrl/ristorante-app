import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTables } from "../api/tables.api.js";
import { getReservations } from "../api/reservations.api.js";
import { getOrders } from "../api/orders.api.js";
import { getMenu } from "../api/menu.api.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTables(), getReservations(), getOrders(), getMenu()])
      .then(([tavoli, prenotazioni, ordini, menu]) => {
        setStats({
          tavoliLiberi:  tavoli.filter((t) => t.stato === "FREE").length,
          tavoliTotali:  tavoli.length,
          prenotazioniOggi: prenotazioni.filter((p) => {
            const oggi = new Date().toDateString();
            return new Date(p.data_ora).toDateString() === oggi && p.stato === "ATTIVA";
          }).length,
          ordiniAttivi: ordini.filter((o) => ["PENDING","PREPARING","READY"].includes(o.stato)).length,
          piatti: menu.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const TILES = [
    { icon: "🪑", num: `${stats?.tavoliLiberi}/${stats?.tavoliTotali}`, label: "Tavoli liberi",   path: "/tavoli" },
    { icon: "📅", num: stats?.prenotazioniOggi, label: "Prenotazioni oggi", path: "/prenotazioni" },
    { icon: "🍳", num: stats?.ordiniAttivi,     label: "Ordini attivi",     path: "/cucina" },
    { icon: "🍽", num: stats?.piatti,           label: "Piatti nel menu",   path: "/menu" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>La Trattoria</h1>
        <p>Pannello di controllo — {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="home-grid">
        {TILES.map((t) => (
          <div
            key={t.path}
            className="home-stat"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(t.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(t.path)}
          >
            <div style={{ fontSize: "2rem", marginBottom: ".25rem" }}>{t.icon}</div>
            <div className="home-stat__num">{t.num}</div>
            <div className="home-stat__label">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", marginBottom: "1rem", color: "var(--color-primary)" }}>
          Accesso rapido
        </h2>
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={() => navigate("/prenotazioni")}>
            📅 Nuova prenotazione
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/cucina")}>
            👨‍🍳 Dashboard cucina
          </button>
          <button className="btn btn-ghost" onClick={() => navigate("/menu")}>
            🍽 Gestione menu
          </button>
        </div>
      </div>
    </div>
  );
}
