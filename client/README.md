# Ristorante — Client (Frontend)

React 18 + Vite + React Router. Nessuna libreria UI esterna: design system
costruito interamente in `src/styles/main.css`.

## Prerequisiti

- Node.js 20+
- Backend `server` in esecuzione su `http://localhost:4000`

## Setup

```bash
npm install
npm run dev
```

L'app parte su `http://localhost:5173`. Tutte le chiamate `/api/*`
vengono proxate automaticamente al backend da `vite.config.js`.

## Struttura

```
src/
├── api/               # Funzioni fetch per ogni entità (tables, menu, orders…)
├── components/
│   ├── ui/            # Componenti riutilizzabili: Alert, Badge, Modal, Spinner
│   ├── layout/        # Navbar + Layout
│   ├── tables/        # TavoliGrid
│   ├── reservations/  # PrenotazioneForm, PrenotazioneCard
│   ├── menu/          # MenuList, MenuForm
│   ├── orders/        # OrdineForm, OrdineCard
│   └── feedback/      # FeedbackForm
├── pages/             # Una pagina per sezione, montate dal router in App.jsx
└── styles/main.css    # Design system completo (variabili CSS, componenti)
```

## Pagine

| Percorso        | Pagina            | Ruolo principale  |
|-----------------|-------------------|-------------------|
| `/`             | Home              | Tutti             |
| `/tavoli`       | Mappa tavoli      | Staff             |
| `/prenotazioni` | Prenotazioni      | Operatore/Cliente |
| `/menu`         | Gestione menu     | Manager           |
| `/cucina`       | Dashboard cucina  | Cucina/Sala       |
| `/feedback`     | Feedback clienti  | Cliente/Manager   |
