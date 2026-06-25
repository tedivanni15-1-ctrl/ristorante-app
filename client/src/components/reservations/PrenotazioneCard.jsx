import { useState } from "react";
import Badge from "../ui/Badge.jsx";
import { cancelReservation } from "../../api/reservations.api.js";

function formatDate(iso) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function PrenotazioneCard({ prenotazione, onRefresh }) {
  const [loading, setLoading] = useState(false);

  async function handleAnnulla() {
    if (!confirm("Annullare questa prenotazione?")) return;
    setLoading(true);
    try {
      await cancelReservation(prenotazione.id);
      onRefresh?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="prenotazione-card">
      <div className="prenotazione-card__nome">
        👤 {prenotazione.nome_cliente}
      </div>
      <div className="prenotazione-card__info">
        📅 {formatDate(prenotazione.data_ora)} &nbsp;·&nbsp;
        🪑 Tavolo #{prenotazione.tavolo_id} &nbsp;·&nbsp;
        👥 {prenotazione.coperti} coperti
      </div>
      <div className="prenotazione-card__footer">
        <Badge stato={prenotazione.stato} />
        {prenotazione.stato === "ATTIVA" && (
          <button
            className="btn btn-danger btn-sm"
            onClick={handleAnnulla}
            disabled={loading}
          >
            {loading ? "…" : "✕ Annulla"}
          </button>
        )}
      </div>
    </div>
  );
}
