import { useState, useEffect } from "react";
import { getMenu } from "../api/menu.api.js";
import MenuList from "../components/menu/MenuList.jsx";
import MenuForm from "../components/menu/MenuForm.jsx";
import Modal from "../components/ui/Modal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Alert from "../components/ui/Alert.jsx";

export default function MenuPage() {
  const [piatti,    setPiatti]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem,  setEditItem]  = useState(null); // null = nuovo, piatto = modifica

  async function load() {
    setLoading(true);
    try {
      setPiatti(await getMenu());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew()     { setEditItem(null);  setShowModal(true); }
  function openEdit(p)   { setEditItem(p);     setShowModal(true); }
  function closeModal()  { setShowModal(false); setEditItem(null); }

  function onFormSuccess() {
    closeModal();
    load();
  }

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Gestione Menu</h1>
          <p>Piatti attivi ({piatti.length}) — solo il Manager può modificare</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          + Aggiungi piatto
        </button>
      </div>

      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      {loading ? (
        <Spinner />
      ) : (
        <MenuList piatti={piatti} onRefresh={load} onEdit={openEdit} />
      )}

      {showModal && (
        <Modal
          title={editItem ? "Modifica piatto" : "Nuovo piatto"}
          onClose={closeModal}
        >
          <MenuForm piatto={editItem} onSuccess={onFormSuccess} />
        </Modal>
      )}
    </div>
  );
}
