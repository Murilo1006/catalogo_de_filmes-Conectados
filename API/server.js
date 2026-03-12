const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(cors());

function lerFilmes(){
const dados = fs.readFileSync("filmes.json");
return JSON.parse(dados);
}

function salvarFilmes(filmes){

    fs.writeFileSync(
        "filmes.json",
        JSON.stringify(filmes, null, 2)
    );
}

app.get("/filmes", (req, res) => {
    const filmes = lerFilmes();
    res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
    const filmes = lerFilmes();

    const filme = filmes.find(
        f => f.id == req.params.id
    );

    res.json(filme);
});

app.post("/filmes", (req, res) => {
    const filmes = lerFilmes();
    const novoFilme = {
        id: Date.now(),
        ...req.body
    };

    filmes.push(novoFilme);
    salvarFilmes(filmes);
    res.json(novoFilme);
});

app.put("/filmes/:id", (req, res) => {
    const filmes = lerFilmes();
    const index = filmes.findIndex(
        f => f.id == req.params.id
    );

    filmes[index] = {
        ...filmes[index],
        ...req.body
    };

    salvarFilmes(filmes);
    res.json(filmes[index]);
});

app.delete("/filmes/:id", (req, res) => {
    let filmes = lerFilmes();
    filmes = filmes.filter(
        f => f.id != req.params.id
    );

    salvarFilmes(filmes);
    res.json({mensagem:"Filme excluído"});
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});