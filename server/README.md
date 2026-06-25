# Ristorante - Backend (server)

API REST in Node.js + Express + PostgreSQL.

## Setup

1. Avvia il database:
   ```
   docker compose up -d
   ```
2. Copia le variabili d'ambiente:
   ```
   cp .env.example .env
   ```
3. Installa le dipendenze e avvia il server:
   ```
   npm install
   npm run dev
   ```

Il server parte su `http://localhost:4000`. Lo schema viene applicato
automaticamente al primo avvio di Postgres tramite `src/migrations/001_init.sql`
(montato in `docker-entrypoint-initdb.d`).

## Endpoint principali

Vedi la matrice completa nella documentazione di progetto. In sintesi:

- `GET/POST/PUT/DELETE /api/v1/reservations`
- `GET /api/v1/tables`, `GET /api/v1/tables/availability`
- `GET/POST/PUT/DELETE /api/v1/menu`
- `GET/POST/PATCH/DELETE /api/v1/orders`
- `GET/POST /api/v1/feedbacks`
