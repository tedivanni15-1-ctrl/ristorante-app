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

-- Tabella utenti staff
CREATE TABLE IF NOT EXISTS utenti (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    ruolo VARCHAR(20) DEFAULT 'cameriere',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utente di default: username=cameriere, password=trattoria123
-- Hash bcrypt generato offline per sicurezza
INSERT INTO utenti (username, password_hash, ruolo)
VALUES ('cameriere', '$2b$10$hkGl6wc.GCiDIDNY2nvV/e7jnbaIncE4wU.Ce.8XmX8A.0AF6VcS.', 'cameriere')
ON CONFLICT (username) DO NOTHING;

-- Seed menu tradizionale italiano
-- Antipasti (categoria_id = 1)
INSERT INTO menu (categoria_id, nome, descrizione, prezzo) VALUES
(1, 'Bruschetta al Pomodoro', 'Pane tostato con pomodoro fresco, aglio, basilico e olio EVO', 6.50),
(1, 'Tagliere di Salumi e Formaggi', 'Selezione di salumi artigianali e formaggi stagionati locali', 13.00),
(1, 'Crostini con Fegatini', 'Crostini di pane toscano con paté di fegatini di pollo', 7.50),
(1, 'Supplì al Telefono', 'Supplì di riso con ragù e mozzarella filante, fritti dorati', 7.00),
(1, 'Burrata con Prosciutto Crudo', 'Burrata fresca pugliese con prosciutto crudo di Parma 24 mesi', 12.00),
(1, 'Carpaccio di Manzo', 'Fettine di manzo crude con rucola, scaglie di grana e limone', 11.00),

-- Primi (categoria_id = 2)
(2, 'Spaghetti al Ragù della Nonna', 'Spaghetti con ragù di carne macinata cotto lentamente per 4 ore', 12.00),
(2, 'Penne all''Arrabbiata', 'Penne con sugo di pomodoro piccante, aglio e peperoncino', 10.00),
(2, 'Risotto ai Funghi Porcini', 'Riso Carnaroli mantecato con porcini freschi e parmigiano', 14.00),
(2, 'Tagliatelle al Tartufo Nero', 'Tagliatelle fresche all''uovo con tartufo nero e burro', 16.00),
(2, 'Lasagne al Forno', 'Lasagne con ragù di carne, besciamella e parmigiano gratinato', 13.00),
(2, 'Ribollita Toscana', 'Zuppa di pane raffermo con fagioli, cavolo nero e verdure', 10.00),
(2, 'Gnocchi al Pomodoro e Basilico', 'Gnocchi di patate fatti in casa con sugo fresco di pomodoro', 11.00),
(2, 'Pasta e Fagioli', 'Pasta corta con fagioli borlotti, rosmarino e olio a crudo', 10.00),

-- Secondi (categoria_id = 3)
(3, 'Bistecca alla Fiorentina', 'Bistecca di Chianina alla brace, al sangue, con sale grosso (600g)', 28.00),
(3, 'Pollo alla Cacciatora', 'Pollo in umido con olive, capperi, pomodoro e vino bianco', 14.00),
(3, 'Ossobuco alla Milanese', 'Stinco di vitello brasato con gremolada, servito con risotto', 18.00),
(3, 'Baccalà alla Livornese', 'Merluzzo salato con pomodoro, olive nere e prezzemolo', 15.00),
(3, 'Saltimbocca alla Romana', 'Fettine di vitello con prosciutto crudo e salvia, in padella', 16.00),
(3, 'Scaloppine al Limone', 'Fettine di vitello con salsa al limone e prezzemolo fresco', 15.00),
(3, 'Trippa alla Romana', 'Trippa in umido con pomodoro, pecorino e mentuccia', 13.00),
(3, 'Fritto Misto di Pesce', 'Calamari, gamberi e pesciolini fritti con limone e salsa tartara', 18.00),

-- Dolci (categoria_id = 4)
(4, 'Tiramisù della Casa', 'Tiramisù classico con savoiardi, mascarpone e caffè espresso', 6.50),
(4, 'Panna Cotta al Caramello', 'Panna cotta con salsa al caramello salato e noci tostate', 6.00),
(4, 'Cannolo Siciliano', 'Cialda croccante con ricotta di pecora, pistacchi e canditi', 5.50),
(4, 'Torta della Nonna', 'Crostata con crema pasticcera e pinoli, ricetta tradizionale', 6.00),
(4, 'Gelato Artigianale', 'Due palline a scelta: fior di latte, cioccolato, pistacchio, nocciola', 5.00),
(4, 'Semifreddo al Torroncino', 'Semifreddo con torrone croccante e salsa al cioccolato fondente', 6.50);
