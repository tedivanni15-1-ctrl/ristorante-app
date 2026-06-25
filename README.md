# 🍽️ Ristorante Web App — Gestionale Full-Stack

Applicazione web per la gestione operativa di un ristorante, sviluppata come progetto ITS.  
L'architettura è divisa in **lato cliente** (prenotazioni, menu, feedback) e **lato cameriere/cucina** (gestione ordini, tavoli, comande).

---

## 📐 Architettura

```
ristorante-app/
├── client/          → Frontend  React 18 + Vite 5
└── server/          → Backend   Node.js 20 + Express 4 + PostgreSQL 16
```

### Stack tecnologico

| Layer      | Tecnologie                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, React Router 6, Vite 5, CSS custom    |
| Backend    | Node.js 20, Express 4, node-postgres (`pg`)     |
| Database   | PostgreSQL 16 (Docker)                          |
| Dev tools  | Docker Compose, ESModules, Vite proxy           |

---

## 🎭 Ruoli e funzionalità

### 👤 Cliente
| Pagina          | Funzione                                      |
|-----------------|-----------------------------------------------|
| `/prenotazioni` | Prenota un tavolo con controllo anti-overbooking |
| `/menu`         | Consulta il menu per categoria               |
| `/feedback`     | Lascia una valutazione (1–5 stelle) sull'ordine |

### 👨‍🍳 Staff (cameriere / cucina)
| Pagina    | Funzione                                              |
|-----------|-------------------------------------------------------|
| `/tavoli` | Mappa dello stato dei tavoli (FREE / RESERVED / OCCUPIED) |
| `/cucina` | Dashboard Kanban con colonne PENDING → PREPARING → READY → SERVED |
| `/menu`   | Gestione del menu: aggiunta, modifica, attivazione piatti |

---

## 🗄️ Modello dati (PostgreSQL)

```
tavoli ──────────────────┐
                         │
prenotazioni ────────────┤  (vincolo EXCLUDE gist anti-overbooking)
         │               │
         └── ordini ─────┘
                │
                ├── dettagli_ordine ── menu ── categorie
                │
                └── feedbacks
```

**Punti di rilievo del database:**
- Tipo `tsrange` + constraint `EXCLUDE USING gist` per prevenire sovrapposizioni di prenotazioni sullo stesso tavolo
- Transizioni di stato degli ordini validate lato server (`PENDING → PREPARING → READY → SERVED`)
- Trigger `set_updated_at` su `ordini` per tracciare l'ultima modifica
- Indici dedicati su colonne frequentemente filtrate (`stato`, `categoria_id`, `data_ora`)

---

## 🔌 API REST — Endpoint principali

| Metodo | Endpoint                          | Descrizione                         |
|--------|-----------------------------------|-------------------------------------|
| GET    | `/api/v1/health`                  | Health check                        |
| GET    | `/api/v1/tables`                  | Lista tavoli                        |
| GET    | `/api/v1/tables/availability`     | Tavoli disponibili per data/ora     |
| GET    | `/api/v1/reservations`            | Lista prenotazioni                  |
| POST   | `/api/v1/reservations`            | Nuova prenotazione                  |
| PUT    | `/api/v1/reservations/:id`        | Modifica prenotazione               |
| DELETE | `/api/v1/reservations/:id`        | Annulla prenotazione                |
| GET    | `/api/v1/menu`                    | Lista piatti (filtrabile)           |
| POST   | `/api/v1/menu`                    | Aggiunge piatto                     |
| PUT    | `/api/v1/menu/:id`                | Modifica piatto                     |
| DELETE | `/api/v1/menu/:id`                | Rimuove piatto                      |
| GET    | `/api/v1/orders`                  | Lista ordini (filtrabile per stato) |
| POST   | `/api/v1/orders`                  | Nuova comanda (transazione SQL)     |
| PATCH  | `/api/v1/orders/:id/status`       | Avanza stato ordine                 |
| DELETE | `/api/v1/orders/:id`              | Annulla ordine (solo PENDING)       |
| GET    | `/api/v1/feedbacks`               | Lista feedback                      |
| POST   | `/api/v1/feedbacks`               | Nuovo feedback                      |

---

## 🚀 Avvio in locale

### Prerequisiti
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1 — Database

```bash
cd server
cp .env.example .env
docker compose up -d
```

Il container PostgreSQL applica automaticamente `src/migrations/001_init.sql`  
al primo avvio (inclusi seed di tavoli e categorie).

### 2 — Backend

```bash
cd server
npm install
npm run dev
# → http://localhost:4000/api/v1/health  →  { "status": "ok" }
```

### 3 — Frontend

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

> **Proxy Vite** — tutte le chiamate `/api/*` vengono inoltrate automaticamente  
> al backend su `localhost:4000` grazie alla configurazione in `vite.config.js`.

---

## 📁 Struttura del progetto

```
client/
├── src/
│   ├── api/               # Fetch helpers per ogni risorsa REST
│   ├── components/
│   │   ├── ui/            # Alert, Badge, Modal, Spinner
│   │   ├── layout/        # Navbar, Layout
│   │   ├── tables/        # TavoliGrid
│   │   ├── reservations/  # PrenotazioneForm, PrenotazioneCard
│   │   ├── menu/          # MenuList, MenuForm
│   │   ├── orders/        # OrdineForm, OrdineCard
│   │   └── feedback/      # FeedbackForm
│   ├── pages/             # Una pagina per sezione
│   └── styles/main.css    # Design system (variabili CSS, componenti)
└── index.html

server/
├── src/
│   ├── config/db.js       # Pool PostgreSQL
│   ├── controllers/       # Logica di business per ogni risorsa
│   ├── routes/            # Definizione route Express
│   ├── middlewares/       # Error handler centralizzato
│   └── migrations/        # Schema SQL + seed
├── server.js
└── docker-compose.yml
```

---

## ✅ Scelte progettuali notevoli

- **Anti-overbooking database-level** — il vincolo `EXCLUDE USING gist` su `tsrange` garantisce l'integrità anche in caso di richieste concorrenti, senza dipendere dalla logica applicativa.
- **Transizioni di stato validate** — il backend rifiuta qualsiasi salto di stato non previsto (es. `PENDING → READY`), mantenendo la macchina a stati coerente.
- **Transazioni SQL per gli ordini** — la creazione di una comanda (inserimento ordine + righe + calcolo totale) avviene in un'unica transazione con `BEGIN / COMMIT / ROLLBACK`.
- **Polling near-real-time** — la dashboard cucina si aggiorna automaticamente ogni 15 secondi senza WebSocket.
- **Design system custom** — nessuna libreria UI esterna; componenti costruiti con variabili CSS in `main.css`.

---

## 👨‍💻 Autore

Progetto sviluppato per il corso **ITS**.  
Anno accademico 2025/2026.
