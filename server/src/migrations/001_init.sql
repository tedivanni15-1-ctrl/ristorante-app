-- Tipi enumerati
CREATE TYPE stato_ordine AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');
CREATE TYPE stato_tavolo AS ENUM ('FREE', 'RESERVED', 'OCCUPIED');
CREATE TYPE stato_prenotazione AS ENUM ('ATTIVA', 'ANNULLATA', 'COMPLETATA');

-- Estensione richiesta dal vincolo anti-overbooking (EXCLUDE su gist)
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE tavoli (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    capienza INT NOT NULL CHECK (capienza > 0),
    stato stato_tavolo DEFAULT 'FREE'
);

CREATE TABLE prenotazioni (
    id SERIAL PRIMARY KEY,
    tavolo_id INT NOT NULL REFERENCES tavoli(id) ON DELETE RESTRICT,
    data_ora TIMESTAMP NOT NULL,
    durata_minuti INT NOT NULL DEFAULT 90 CHECK (durata_minuti > 0),
    periodo tsrange GENERATED ALWAYS AS (
        tsrange(data_ora, data_ora + (durata_minuti || ' minutes')::interval)
    ) STORED,
    nome_cliente VARCHAR(100) NOT NULL,
    coperti INT NOT NULL CHECK (coperti > 0),
    stato stato_prenotazione DEFAULT 'ATTIVA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT no_overlap_per_tavolo EXCLUDE USING gist (
        tavolo_id WITH =,
        periodo WITH &&
    ) WHERE (stato = 'ATTIVA')
);

CREATE INDEX idx_prenotazioni_data ON prenotazioni(data_ora);

CREATE TABLE categorie (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE menu (
    id SERIAL PRIMARY KEY,
    categoria_id INT REFERENCES categorie(id) ON DELETE RESTRICT,
    nome VARCHAR(100) NOT NULL,
    descrizione TEXT,
    prezzo DECIMAL(6,2) NOT NULL CHECK (prezzo > 0),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_menu_categoria_attivi ON menu(categoria_id) WHERE is_active = TRUE;

CREATE TABLE ordini (
    id SERIAL PRIMARY KEY,
    prenotazione_id INT REFERENCES prenotazioni(id) ON DELETE RESTRICT,
    stato stato_ordine DEFAULT 'PENDING',
    totale DECIMAL(8,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ordini_stato ON ordini(stato);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ordini_updated_at
BEFORE UPDATE ON ordini
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE dettagli_ordine (
    id SERIAL PRIMARY KEY,
    ordine_id INT NOT NULL REFERENCES ordini(id) ON DELETE CASCADE,
    piatto_id INT NOT NULL REFERENCES menu(id) ON DELETE RESTRICT,
    quantita INT NOT NULL CHECK (quantita > 0),
    note TEXT
);

CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    ordine_id INT NOT NULL REFERENCES ordini(id) ON DELETE CASCADE,
    punteggio INT NOT NULL CHECK (punteggio BETWEEN 1 AND 5),
    recensione TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed minimo per sviluppo locale
INSERT INTO tavoli (numero, capienza) VALUES (1, 2), (2, 4), (3, 4), (4, 6);
INSERT INTO categorie (nome) VALUES ('Antipasti'), ('Primi'), ('Secondi'), ('Dolci');
