const API = "http://localhost:3000/filmes";

async function getFilmes() {
    const lista = document.getElementById("listaFilmes");
    lista.innerHTML = "Carregando...";

    const resposta = await fetch(API);
    const filmes = await resposta.json();

    lista.innerHTML = "";

    filmes.forEach(filme => {

        lista.innerHTML += `
        <div>
            <img src="${filme.capa}" alt="Capa do Filme" onerror="this.src='img/sem imagem.gif'">

            <h3>${filme.titulo}</h3>
            <p>Diretor: ${filme.diretor}</p>
            <p>Ano: ${filme.ano}</p>

            <button onclick="editarFilme(${filme.id})">Editar</button>
            <button onclick="deletarFilme(${filme.id})">Excluir</button>        
        </div>
        `;
    });
}

document.getElementById("formFilme").addEventListener("submit", async function(e) {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const diretor = document.getElementById("diretor").value;
    const ano = document.getElementById("ano").value;
    const capa = document.getElementById("capa").value;

    if (!titulo.trim()) {
    alert("O título do filme é obrigatório.");
    return;
}

if (ano < 1888 || ano > new Date().getFullYear()) {
    alert("Ano inválido.");
    return;
}

    const filme = {
        titulo,
        diretor,
        ano,
        capa: capa.trim() && (capa.startsWith("http") || capa.startsWith("https")) 
        ? capa 
        : "img/sem imagem.gif"
    };

    if(filmeEditando){

        await fetch(`${API}/${filmeEditando}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filme)
        });

        filmeEditando = null;

    } else {

        await fetch(API,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filme)
        });

    }

    limparFormulario();
    document.getElementById("botaoSubmit").textContent = "Adicionar Filme";
    getFilmes();
});

function limparFormulario(){

 document.getElementById("titulo").value = "";
 document.getElementById("diretor").value = "";
 document.getElementById("ano").value = "";
 document.getElementById("capa").value = "";

}

async function deletarFilme(id){
    await fetch(`${API}/${id}`,{
        method: "DELETE"
    });

    getFilmes();

}

let filmeEditando = null;

async function editarFilme(id) {
    const resposta = await fetch(`${API}/${id}`);
    const filme = await resposta.json();
    
    document.getElementById("titulo").value = filme.titulo;
    document.getElementById("diretor").value = filme.diretor;
    document.getElementById("ano").value = filme.ano;
    document.getElementById("capa").value = filme.capa;

    document.getElementById("botaoSubmit").textContent = "Atualizar Filme";
    
    filmeEditando = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
getFilmes();

    