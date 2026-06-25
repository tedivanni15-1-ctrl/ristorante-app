import { useState, useEffect, useCallback } from "react";
import { getOrders } from "../api/orders.api.js";
import OrdineCard from "../components/orders/OrdineCard.jsx";
import OrdineForm from "../components/orders/OrdineForm.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";

const COLONNE = [
  { stato: "PENDING",   label: "In attesa",      color: "#d4a017" },
  { stato: "PREPARING", label: "In cucina",       color: "#e07b39" },
  { stato: "READY",     label: "Pronti",          color: "#3a8c4a" },
  { stato: "SERVED",    label: "Serviti",         color: "#5a7fa8" },
];

export default function CucinaPage() {
  const [ordini,    setOrdini]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrdini(await getOrders());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Polling ogni 15 secondi — simula near-real-time per la cucina
  useEffect(() => {
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [load]);

  const ordiniPerStato = (stato) => ordini.filter((o) => o.stato === stato);

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Dashboard Cucina & Sala</h1>
          <p>Aggiornamento automatico ogni 15 secondi</p>
        </div>
        <div style={{ display: "flex", gap: ".75rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={load}>🔄 Aggiorna</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nuova comanda
          </button>
        </div>
      </div>

      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.25rem",
            alignItems: "start",
          }}
        >
          {COLONNE.map((col) => {
            const lista = ordiniPerStato(col.stato);
            return (
              <div key={col.stato}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: ".75rem",
                    paddingBottom: ".5rem",
                    borderBottom: `3px solid ${col.color}`,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: ".95rem" }}>{col.label}</span>
                  <span
                    style={{
                      background: col.color,
                      color: "#fff",
                      borderRadius: "999px",
                      padding: ".1rem .55rem",
                      fontSize: ".8rem",
                      fontWeight: 700,
                    }}
                  >
                    {lista.length}
                  </span>
                </div>

                {lista.length === 0 ? (
                  <div style={{ textAlign: "center", color: "var(--color-text-muted)", fontSize: ".85rem", padding: "1.5rem 0" }}>
                    Nessun ordine
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                    {lista.map((o) => (
                      <OrdineCard key={o.id} ordine={o} onRefresh={load} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="Nuova Comanda" onClose={() => setShowModal(false)}>
          <OrdineForm onSuccess={() => { setShowModal(false); load(); }} />
        </Modal>
      )}
    </div>
  );
}
