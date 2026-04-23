const db = require('./database');

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


// ─── GET /filmes ───
app.get("/filmes", (req, res) => {
    const filmes = db.prepare("SELECT * FROM filmes").all();
    res.json(filmes);
});


// ─── GET /filmes/:id ─── (bônus do material)
app.get("/filmes", (req, res) => {

    const { titulo } = req.query;

    let filmes;

    if (titulo) {
        filmes = db
            .prepare("SELECT * FROM filmes WHERE titulo LIKE ? ORDER BY ano DESC")
            .all(`%${titulo}%`);
    } else {
        filmes = db
            .prepare("SELECT * FROM filmes ORDER BY ano DESC")
            .all();
    }

    res.json(filmes);
});


// ─── POST /filmes ───
app.post("/filmes", (req, res) => {

    const { titulo, diretor, ano, capa_url } = req.body;

    if (!titulo || !diretor || !ano) {
        return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const stmt = db.prepare(
        "INSERT INTO filmes (titulo, diretor, ano, capa_url) VALUES (?, ?, ?, ?)"
    );

    const result = stmt.run(titulo, diretor, Number(ano), capa_url || null);

    res.status(201).json({
        id: result.lastInsertRowid,
        titulo,
        diretor,
        ano
    });
});


// ─── PUT /filmes/:id ───
app.put("/filmes/:id", (req, res) => {

    const { titulo, diretor, ano, capa_url } = req.body;
    const { id } = req.params;

    const stmt = db.prepare(
        "UPDATE filmes SET titulo=?, diretor=?, ano=?, capa_url=? WHERE id=?"
    );

    const result = stmt.run(titulo, diretor, Number(ano), capa_url || null, id);

    if (result.changes === 0) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    res.json({ mensagem: "Filme atualizado com sucesso" });
});


// ─── DELETE /filmes/:id ───
app.delete("/filmes/:id", (req, res) => {

    const result = db
        .prepare("DELETE FROM filmes WHERE id = ?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    res.json({ mensagem: "Filme excluído com sucesso" });
});


app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});