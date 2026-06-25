import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Pagine pubbliche (cliente)
import HomeCliente from "./pages/HomeCliente.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PrenotazioniPage from "./pages/PrenotazioniPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// Pagine staff (protette)
import HomeStaff from "./pages/HomeStaff.jsx";
import TavoliPage from "./pages/TavoliPage.jsx";
import CucinaPage from "./pages/CucinaPage.jsx";
import MenuPageStaff from "./pages/MenuPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login — fuori dal layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Layout condiviso */}
        <Route path="/" element={<Layout />}>

          {/* ── AREA CLIENTE (pubblica) ── */}
          <Route index element={<HomeCliente />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="prenotazioni" element={<PrenotazioniPage />} />
          <Route path="feedback" element={<FeedbackPage />} />

          {/* ── AREA STAFF (protetta) ── */}
          <Route path="staff" element={<ProtectedRoute><HomeStaff /></ProtectedRoute>} />
          <Route path="staff/tavoli" element={<ProtectedRoute><TavoliPage /></ProtectedRoute>} />
          <Route path="staff/cucina" element={<ProtectedRoute><CucinaPage /></ProtectedRoute>} />
          <Route path="staff/menu" element={<ProtectedRoute><MenuPageStaff /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
