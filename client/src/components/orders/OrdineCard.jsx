import { useState } from "react";
import Badge from "../ui/Badge.jsx";
import { updateOrderStatus, cancelOrder } from "../../api/orders.api.js";

// Mappa stato → azioni consentite
const NEXT_ACTIONS = {
  PENDING:   [{ label: "▶ Inizia preparazione", stato: "PREPARING", cls: "btn-primary" },
              { label: "✕ Annulla",              stato: "CANCEL",    cls: "btn-danger" }],
  PREPARING: [{ label: "✅ Pronto",              stato: "READY",     cls: "btn-primary" }],
  READY:     [{ label: "🍽 Servito",             stato: "SERVED",    cls: "btn-primary" }],
  SERVED:    [],
  CANCELLED: [],
};

function formatOra(iso) {
  return new Date(iso).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

export default function OrdineCard({ ordine, onRefresh }) {
  const [loading, setLoading] = useState(false);

  async function handleAction(stato) {
    setLoading(true);
    try {
      if (stato === "CANCEL") {
        await cancelOrder(ordine.id);
      } else {
        await updateOrderStatus(ordine.id, stato);
      }
      onRefresh?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const azioni = NEXT_ACTIONS[ordine.stato] ?? [];

  return (
    <div className="ordine-card" data-stato={ordine.stato}>
      <div className="ordine-card__header">
        <span className="ordine-card__id">Ordine #{ordine.id}</span>
        <Badge stato={ordine.stato} />
      </div>

      <div style={{ fontSize: ".85rem", color: "var(--color-text-muted)" }}>
        ⏱ {formatOra(ordine.created_at)}
      </div>

      <div className="ordine-card__totale">€ {Number(ordine.totale).toFixed(2)}</div>

      {azioni.length > 0 && (
        <div className="ordine-card__actions">
          {azioni.map((az) => (
            <button
              key={az.stato}
              className={`btn ${az.cls} btn-sm`}
              onClick={() => handleAction(az.stato)}
              disabled={loading}
            >
              {az.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
