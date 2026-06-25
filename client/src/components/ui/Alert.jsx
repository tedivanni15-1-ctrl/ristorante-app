// type: "error" | "success" | "info"
export default function Alert({ type = "info", children, onDismiss }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
          aria-label="Chiudi"
        >
          ✕
        </button>
      )}
    </div>
  );
}
