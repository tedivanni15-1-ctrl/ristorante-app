import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/",            label: "🏠 Home" },
  { to: "/tavoli",      label: "🪑 Tavoli" },
  { to: "/prenotazioni",label: "📅 Prenotazioni" },
  { to: "/menu",        label: "🍽 Menu" },
  { to: "/cucina",      label: "👨‍🍳 Cucina" },
  { to: "/feedback",    label: "⭐ Feedback" },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand">
        La Trattoria
      </NavLink>
      <ul className="navbar__links">
        {LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
