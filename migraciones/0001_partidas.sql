-- Partidas de ajedrez en línea (papá ↔ Ana Isabella). Sin nombres ni datos
-- personales: solo el código de la partida, una clave secreta por color y
-- las jugadas. Las partidas viejas se borran solas al crear una nueva.
CREATE TABLE IF NOT EXISTS partidas (
  codigo TEXT PRIMARY KEY,          -- lo que se escribe para entrar, ej. 4821
  clave_w TEXT,                     -- secreta del que juega con blancas
  clave_b TEXT,                     -- secreta del que juega con negras
  jugadas TEXT NOT NULL DEFAULT '', -- "e2e4 e7e5 g1f3…" (coronación: e7e8q)
  estado TEXT NOT NULL DEFAULT 'esperando', -- esperando | jugando | rinde-w | rinde-b
  creada INTEGER NOT NULL,
  actualizada INTEGER NOT NULL
);
