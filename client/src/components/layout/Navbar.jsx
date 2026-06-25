import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS_CLIENTE = [
  { to: "/",            label: "🏠 Home" },
  { to: "/menu",        label: "🍽 Menu" },
  { to: "/prenotazioni",label: "📅 Prenota" },
  { to: "/feedback",    label: "⭐ Feedback" },
];

const LINKS_STAFF = [
  { to: "/staff",         label: "🏠 Dashboard" },
  { to: "/staff/tavoli",  label: "🪑 Tavoli" },
  { to: "/staff/cucina",  label: "👨‍🍳 Cucina" },
  { to: "/staff/menu",    label: "🍽 Menu" },
];

export default function Navbar() {
  const { isAuth, utente, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const links = isAuth ? LINKS_STAFF : LINKS_CLIENTE;

  return (
    <nav className="navbar">
      <NavLink to={isAuth ? "/staff" : "/"} className="navbar__brand">
        La Trattoria {isAuth && <span style={{ fontSize: ".75rem", opacity: .7 }}>— Staff</span>}
      </NavLink>

      <ul className="navbar__links">
        {links.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/" || to === "/staff"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
        {isAuth ? (
          <>
            <span style={{ fontSize: ".85rem", color: "var(--color-text-muted)" }}>
              {utente?.username}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Esci
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Area Staff →
          </NavLink>
        )}
      </div>
    </nav>
  );
}
