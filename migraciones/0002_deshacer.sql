-- Pedido de deshacer en las partidas en línea: el color que lo pidió
-- ('w' o 'b') mientras el rival no conteste; NULL si no hay pedido.
ALTER TABLE partidas ADD COLUMN deshacer TEXT;
