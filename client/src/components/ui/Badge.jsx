const LABELS = {
  PENDING:    "In attesa",
  PREPARING:  "In cucina",
  READY:      "Pronto",
  SERVED:     "Servito",
  CANCELLED:  "Annullato",
  FREE:       "Libero",
  RESERVED:   "Riservato",
  OCCUPIED:   "Occupato",
  ATTIVA:     "Attiva",
  ANNULLATA:  "Annullata",
  COMPLETATA: "Completata",
};

export default function Badge({ stato }) {
  return (
    <span className={`badge badge-${stato}`}>
      {LABELS[stato] ?? stato}
    </span>
  );
}
