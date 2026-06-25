import { useState, useEffect } from "react";
import { getReservations } from "../../api/reservations.api.js";
import { getMenu } from "../../api/menu.api.js";
import { createOrder } from "../../api/orders.api.js";
import Alert from "../ui/Alert.jsx";
import Spinner from "../ui/Spinner.jsx";

export default function OrdineForm({ onSuccess }) {
  const [prenotazioni, setPrenotazioni]   = useState([]);
  const [menuItems,    setMenuItems]       = useState([]);
  const [loading,      setLoading]         = useState(true);
  const [sending,      setSending]         = useState(false);
  const [error,        setError]           = useState("");

  const [prenotazioneId, setPrenotazioneId] = useState("");
  const [righe,          setRighe]          = useState([]); // [{ piatto_id, nome, prezzo, quantita, note }]

  useEffect(() => {
    Promise.all([getReservations(), getMenu()])
      .then(([pren, men]) => {
        setPrenotazioni(pren.filter((p) => p.stato === "ATTIVA"));
        setMenuItems(men);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function aggiungiPiatto(piatto) {
    setRighe((prev) => {
      const exist = prev.find((r) => r.piatto_id === piatto.id);
      if (exist) return prev.map((r) => r.piatto_id === piatto.id ? { ...r, quantita: r.quantita + 1 } : r);
      return [...prev, { piatto_id: piatto.id, nome: piatto.nome, prezzo: Number(piatto.prezzo), quantita: 1, note: "" }];
    });
  }

  function rimuoviRiga(piatto_id) {
    setRighe((prev) => prev.filter((r) => r.piatto_id !== piatto_id));
  }

  function aggiornaNota(piatto_id, nota) {
    setRighe((prev) => prev.map((r) => r.piatto_id === piatto_id ? { ...r, note: nota } : r));
  }

  function totale() {
    return righe.reduce((s, r) => s + r.prezzo * r.quantita, 0).toFixed(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!righe.length) { setError("Aggiungi almeno un piatto alla comanda."); return; }
    setSending(true);
    setError("");
    try {
      await createOrder({
        prenotazione_id: Number(prenotazioneId),
        righe: righe.map(({ piatto_id, quantita, note }) => ({ piatto_id, quantita, note })),
      });
      setRighe([]);
      setPrenotazioneId("");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <Spinner />;

  // Raggruppa menu per categoria
  const gruppiMenu = menuItems.reduce((acc, p) => {
    const cat = p.categoria || "Altro";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      {/* Selezione prenotazione */}
      <div className="form-group">
        <label>Prenotazione</label>
        <select
          required
          value={prenotazioneId}
          onChange={(e) => setPrenotazioneId(e.target.value)}
        >
          <option value="">— Seleziona prenotazione attiva —</option>
          {prenotazioni.map((p) => (
            <option key={p.id} value={p.id}>
              #{p.id} — {p.nome_cliente} — Tavolo {p.tavolo_id}
            </option>
          ))}
        </select>
      </div>

      {/* Menu a sfoglio */}
      {Object.entries(gruppiMenu).map(([cat, lista]) => (
        <div key={cat}>
          <p className="section-title" style={{ marginTop: ".75rem" }}>{cat}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {lista.map((p) => (
              <div key={p.id} className="menu-item">
                <div className="menu-item__info">
                  <div className="menu-item__nome">{p.nome}</div>
                </div>
                <div className="menu-item__price">€ {Number(p.prezzo).toFixed(2)}</div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => aggiungiPiatto(p)}
                >
                  + Aggiungi
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Riepilogo comanda */}
      {righe.length > 0 && (
        <div className="card" style={{ marginTop: ".5rem" }}>
          <h3 style={{ marginBottom: ".75rem", fontFamily: "var(--font-display)" }}>
            🧾 Comanda
          </h3>
          {righe.map((r) => (
            <div key={r.piatto_id} style={{ display: "flex", flexDirection: "column", gap: ".3rem", marginBottom: ".75rem", borderBottom: "1px solid var(--color-border)", paddingBottom: ".75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>
                  x{r.quantita} {r.nome}
                </span>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <span>€ {(r.prezzo * r.quantita).toFixed(2)}</span>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => rimuoviRiga(r.piatto_id)}>✕</button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Note (es. senza glutine)"
                value={r.note}
                onChange={(e) => aggiornaNota(r.piatto_id, e.target.value)}
                style={{ padding: ".35rem .65rem", fontSize: ".82rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
            <span>Totale stimato</span>
            <span>€ {totale()}</span>
          </div>
        </div>
      )}

      <button className="btn btn-primary btn-full" type="submit" disabled={sending}>
        {sending ? "Invio comanda…" : "📨 Invia comanda in cucina"}
      </button>
    </form>
  );
}
