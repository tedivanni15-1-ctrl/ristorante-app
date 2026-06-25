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
