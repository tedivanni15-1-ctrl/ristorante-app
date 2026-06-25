import { useState } from "react";
import { getAvailability } from "../../api/tables.api.js";
import { createReservation } from "../../api/reservations.api.js";
import Alert from "../ui/Alert.jsx";

export default function PrenotazioneForm({ onSuccess }) {
  const [step, setStep] = useState(1); // 1: cerca, 2: scegli tavolo, 3: conferma

  const [search, setSearch] = useState({ date: "", time: "", guests: "" });
  const [tavoli, setTavoli] = useState([]);
  const [tavoloScelto, setTavoloScelto] = useState(null);
  const [cliente, setCliente] = useState({ nome_cliente: "", durata_minuti: 90 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await getAvailability(search.date, search.time, search.guests);
      setTavoli(data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConferma(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const dataOra = `${search.date}T${search.time}:00`;
      await createReservation({
        tavolo_id: tavoloScelto.id,
        data_ora: dataOra,
        durata_minuti: Number(cliente.durata_minuti),
        nome_cliente: cliente.nome_cliente,
        coperti: Number(search.guests),
      });
      setSuccess(`Prenotazione confermata per ${cliente.nome_cliente}!`);
      onSuccess?.();
      setStep(1);
      setSearch({ date: "", time: "", guests: "" });
      setTavoloScelto(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {error   && <Alert type="error"   onDismiss={() => setError("")}>{error}</Alert>}
      {success && <Alert type="success" onDismiss={() => setSuccess("")}>{success}</Alert>}

      {/* STEP 1: ricerca disponibilità */}
      {step === 1 && (
        <form className="form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Ora</label>
              <input
                type="time"
                required
                value={search.time}
                onChange={(e) => setSearch({ ...search, time: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Numero coperti</label>
            <input
              type="number"
              min="1"
              max="20"
              required
              value={search.guests}
              onChange={(e) => setSearch({ ...search, guests: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Cerco…" : "🔍 Cerca disponibilità"}
          </button>
        </form>
      )}

      {/* STEP 2: scelta tavolo */}
      {step === 2 && (
        <div>
          <button className="btn btn-secondary btn-sm mb-2" onClick={() => setStep(1)}>
            ← Modifica ricerca
          </button>

          {tavoli.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>
              Nessun tavolo disponibile per i parametri scelti.
            </p>
          ) : (
            <div className="grid-3">
              {tavoli.map((t) => (
                <div
                  key={t.id}
                  className="tavolo-card"
                  style={{
                    cursor: "pointer",
                    borderColor: tavoloScelto?.id === t.id ? "var(--color-primary)" : undefined,
                  }}
                  onClick={() => { setTavoloScelto(t); setStep(3); }}
                >
                  <div className="tavolo-card__num">T{t.numero}</div>
                  <div className="tavolo-card__cap">👤 {t.capienza} posti</div>
                  <button className="btn btn-primary btn-sm btn-full">Scegli</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: dati cliente e conferma */}
      {step === 3 && tavoloScelto && (
        <form className="form" onSubmit={handleConferma}>
          <Alert type="info">
            Tavolo {tavoloScelto.numero} — {tavoloScelto.capienza} posti —{" "}
            {search.date} alle {search.time}
          </Alert>
          <div className="form-group">
            <label>Nome cliente</label>
            <input
              type="text"
              required
              placeholder="Es. Mario Rossi"
              value={cliente.nome_cliente}
              onChange={(e) => setCliente({ ...cliente, nome_cliente: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Durata stimata (minuti)</label>
            <input
              type="number"
              min="30"
              max="300"
              value={cliente.durata_minuti}
              onChange={(e) => setCliente({ ...cliente, durata_minuti: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
              ← Cambia tavolo
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Confermo…" : "✅ Conferma prenotazione"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
