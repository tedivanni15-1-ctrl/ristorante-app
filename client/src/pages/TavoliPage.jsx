import { useState, useEffect } from "react";
import { getTables } from "../api/tables.api.js";
import TavoliGrid from "../components/tables/TavoliGrid.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";

export default function TavoliPage() {
  const [tavoli,  setTavoli]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  async function load() {
    setLoading(true);
    try {
      setTavoli(await getTables());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Refresh automatico ogni 30 secondi
  useEffect(() => {
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, []);

  const liberi    = tavoli.filter((t) => t.stato === "FREE").length;
  const riservati = tavoli.filter((t) => t.stato === "RESERVED").length;
  const occupati  = tavoli.filter((t) => t.stato === "OCCUPIED").length;

  return (
    <div>
      <div className="page-header">
        <h1>Mappa Tavoli</h1>
        <p>Situazione in sala aggiornata in tempo reale (polling 30 s)</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Riepilogo rapido */}
      <div style={{ display: "flex", gap: "1.25rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Liberi",    val: liberi,    color: "var(--color-ready)" },
          { label: "Riservati", val: riservati, color: "var(--color-pending)" },
          { label: "Occupati",  val: occupati,  color: "var(--color-preparing)" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--color-surface)",
              border: `2px solid ${s.color}`,
              borderRadius: "var(--radius-md)",
              padding: ".75rem 1.25rem",
              minWidth: 100,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: ".8rem", color: "var(--color-text-muted)" }}>{s.label}</div>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: "center" }} onClick={load}>
          🔄 Aggiorna
        </button>
      </div>

      {loading ? <Spinner /> : <TavoliGrid tavoli={tavoli} />}
    </div>
  );
}
