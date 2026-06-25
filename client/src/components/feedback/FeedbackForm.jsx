import { useState, useEffect } from "react";
import { getOrders } from "../../api/orders.api.js";
import { createFeedback } from "../../api/feedback.api.js";
import Alert from "../ui/Alert.jsx";

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: ".25rem", fontSize: "2rem", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{ color: n <= (hover || value) ? "#f0a500" : "#ddd", transition: "color 120ms" }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          role="button"
          aria-label={`${n} stelle`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbackForm({ onSuccess }) {
  const [ordini,      setOrdini]      = useState([]);
  const [form,        setForm]        = useState({ ordine_id: "", punteggio: 0, recensione: "" });
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  useEffect(() => {
    getOrders("SERVED").then(setOrdini).catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.punteggio) { setError("Scegli un voto da 1 a 5 stelle."); return; }
    setLoading(true);
    setError("");
    try {
      await createFeedback({
        ordine_id: Number(form.ordine_id),
        punteggio: form.punteggio,
        recensione: form.recensione,
      });
      setSuccess("Grazie per il tuo feedback!");
      setForm({ ordine_id: "", punteggio: 0, recensione: "" });
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error   && <Alert type="error"   onDismiss={() => setError("")}>{error}</Alert>}
      {success && <Alert type="success" onDismiss={() => setSuccess("")}>{success}</Alert>}

      <div className="form-group">
        <label>Ordine di riferimento</label>
        <select
          required
          value={form.ordine_id}
          onChange={(e) => setForm({ ...form, ordine_id: e.target.value })}
        >
          <option value="">— Seleziona ordine servito —</option>
          {ordini.map((o) => (
            <option key={o.id} value={o.id}>
              Ordine #{o.id} — € {Number(o.totale).toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Voto</label>
        <StarPicker
          value={form.punteggio}
          onChange={(n) => setForm({ ...form, punteggio: n })}
        />
      </div>

      <div className="form-group">
        <label>Recensione (facoltativa)</label>
        <textarea
          rows={3}
          placeholder="Racconta la tua esperienza..."
          value={form.recensione}
          onChange={(e) => setForm({ ...form, recensione: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Invio…" : "⭐ Invia feedback"}
      </button>
    </form>
  );
}
