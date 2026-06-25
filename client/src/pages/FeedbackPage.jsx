import { useState, useEffect } from "react";
import { getFeedback } from "../api/feedback.api.js";
import FeedbackForm from "../components/feedback/FeedbackForm.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";

function Stars({ n }) {
  return (
    <span className="stars">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function formatData(iso) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function FeedbackPage() {
  const [data,      setData]      = useState({ feedbacks: [], punteggio_medio: null });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [showModal, setShowModal] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setData(await getFeedback());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const { feedbacks, punteggio_medio } = data;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Feedback Clienti</h1>
          <p>Recensioni e customer satisfaction</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ⭐ Lascia feedback
        </button>
      </div>

      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      {/* Media voto */}
      {punteggio_medio !== null && (
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <div className="media-voto">{Number(punteggio_medio).toFixed(1)}</div>
            <div style={{ fontSize: ".8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: ".05em" }}>
              Media su {feedbacks.length} {feedbacks.length === 1 ? "recensione" : "recensioni"}
            </div>
          </div>
          <Stars n={Math.round(punteggio_medio)} />
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : feedbacks.length === 0 ? (
        <div className="empty">
          <div className="empty__icon">⭐</div>
          <p>Nessuna recensione ancora. Sii il primo!</p>
        </div>
      ) : (
        <div className="grid-2">
          {feedbacks.map((f) => (
            <div key={f.id} className="feedback-card">
              <Stars n={f.punteggio} />
              {f.recensione && <p style={{ fontSize: ".9rem", marginTop: ".25rem" }}>{f.recensione}</p>}
              <div style={{ fontSize: ".78rem", color: "var(--color-text-muted)", marginTop: ".35rem" }}>
                Ordine #{f.ordine_id} — {formatData(f.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Lascia un feedback" onClose={() => setShowModal(false)}>
          <FeedbackForm onSuccess={() => { setShowModal(false); load(); }} />
        </Modal>
      )}
    </div>
  );
}
