import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import TavoliPage from "./pages/TavoliPage.jsx";
import PrenotazioniPage from "./pages/PrenotazioniPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CucinaPage from "./pages/CucinaPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tavoli" element={<TavoliPage />} />
        <Route path="prenotazioni" element={<PrenotazioniPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="cucina" element={<CucinaPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
