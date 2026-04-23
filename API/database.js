const Database = require('better-sqlite3');

const db = new Database('filmes.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS filmes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT    NOT NULL,
    diretor   TEXT    NOT NULL,
    ano       INTEGER NOT NULL,
    capa_url  TEXT
  )
`);

module.exports = db;