import { useState, useEffect } from "react";
import { getReservations } from "../api/reservations.api.js";
import PrenotazioneForm from "../components/reservations/PrenotazioneForm.jsx";
import PrenotazioneCard from "../components/reservations/PrenotazioneCard.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";

export default function PrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [showModal,    setShowModal]    = useState(false);

  async function load() {
    setLoading(true);
    try {
      setPrenotazioni(await getReservations());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const attive    = prenotazioni.filter((p) => p.stato === "ATTIVA");
  const storiche  = prenotazioni.filter((p) => p.stato !== "ATTIVA");

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Prenotazioni</h1>
          <p>Gestione e storico prenotazioni tavoli</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nuova prenotazione
        </button>
      </div>

      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2 className="section-title">Prenotazioni attive ({attive.length})</h2>
          {attive.length === 0 ? (
            <div className="empty"><div className="empty__icon">📅</div><p>Nessuna prenotazione attiva.</p></div>
          ) : (
            <div className="grid-2">
              {attive.map((p) => (
                <PrenotazioneCard key={p.id} prenotazione={p} onRefresh={load} />
              ))}
            </div>
          )}

          {storiche.length > 0 && (
            <>
              <h2 className="section-title" style={{ marginTop: "2rem" }}>
                Storico ({storiche.length})
              </h2>
              <div className="grid-2">
                {storiche.slice(0, 20).map((p) => (
                  <PrenotazioneCard key={p.id} prenotazione={p} onRefresh={load} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {showModal && (
        <Modal title="Nuova Prenotazione" onClose={() => setShowModal(false)}>
          <PrenotazioneForm
            onSuccess={() => { setShowModal(false); load(); }}
          />
        </Modal>
      )}
    </div>
  );
}
