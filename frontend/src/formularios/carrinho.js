
const itens = document.getElementById("itens-carrinho");
const total = document.getElementById("total");

// Busca os produtos salvos no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let valorTotal = 0;

itens.innerHTML = "";

carrinho.forEach(function(produto) {

    itens.innerHTML += `
        <p>${produto.nome} - R$ ${produto.preco}</p>
    `;

    valorTotal += Number(produto.preco);

});

total.innerHTML = "Total: R$ " + valorTotal.toFixed(2).replace(".", ",");
