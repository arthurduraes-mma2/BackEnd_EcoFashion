
const lista = document.getElementById("lista-produtos");

fetch("http://localhost:3000/produtos")
    .then(resposta => resposta.json())
    .then(produtos => {

        lista.innerHTML = "";

        produtos.forEach(produto => {

            lista.innerHTML += `
                <div class="produto-card">
                    <h3>${produto.nome}</h3>
                    <p>Preço: R$ ${produto.preco}</p>
                    <p>Estoque: ${produto.estoque}</p>

                    <button onclick="adicionarCarrinho(${produto.id})">
                        Adicionar ao carrinho
                    </button>
                </div>
            `;

        });

    })
    .catch(() => {
        lista.innerHTML = "Não foi possível carregar os produtos.";
    });


function adicionarCarrinho(id) {

    fetch("http://localhost:3000/produtos/" + id)
        .then(resposta => resposta.json())
        .then(produto => {

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            carrinho.push(produto);

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            alert("Produto adicionado ao carrinho!");

        });

}
