import { useState, useEffect } from "react";
import { createMenuItem, updateMenuItem } from "../../api/menu.api.js";
import Alert from "../ui/Alert.jsx";

// Categorie fisse (seed del DB); in produzione si potrebbe caricare via API
const CATEGORIE = [
  { id: 1, nome: "Antipasti" },
  { id: 2, nome: "Primi" },
  { id: 3, nome: "Secondi" },
  { id: 4, nome: "Dolci" },
];

export default function MenuForm({ piatto, onSuccess }) {
  const isEdit = Boolean(piatto);

  const [form, setForm] = useState({
    nome:         piatto?.nome         ?? "",
    descrizione:  piatto?.descrizione  ?? "",
    prezzo:       piatto?.prezzo       ?? "",
    categoria_id: piatto?.categoria_id ?? CATEGORIE[0].id,
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Sincronizza se il piatto cambia (es. apertura edit diversa)
  useEffect(() => {
    if (piatto) {
      setForm({
        nome:         piatto.nome,
        descrizione:  piatto.descrizione ?? "",
        prezzo:       piatto.prezzo,
        categoria_id: piatto.categoria_id,
      });
    }
  }, [piatto]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, prezzo: Number(form.prezzo), categoria_id: Number(form.categoria_id) };
      if (isEdit) {
        await updateMenuItem(piatto.id, payload);
      } else {
        await createMenuItem(payload);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <Alert type="error" onDismiss={() => setError("")}>{error}</Alert>}

      <div className="form-group">
        <label>Nome piatto</label>
        <input
          name="nome"
          required
          placeholder="Es. Tagliatelle al ragù"
          value={form.nome}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Descrizione</label>
        <textarea
          name="descrizione"
          rows={2}
          placeholder="Ingredienti, allergeni, note..."
          value={form.descrizione}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Prezzo (€)</label>
          <input
            name="prezzo"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="12.50"
            value={form.prezzo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
            {CATEGORIE.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Salvo…" : isEdit ? "✏️ Aggiorna piatto" : "➕ Aggiungi piatto"}
      </button>
    </form>
  );
}
