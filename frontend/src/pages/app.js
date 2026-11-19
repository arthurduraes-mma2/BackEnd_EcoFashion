
const API_URL = "http://localhost:3000";

// ELEMENTO ONDE OS PRODUTOS APARECERÃO
const listaProdutos = document.getElementById("lista-produtos");

// BUSCAR E MOSTRAR OS PRODUTOS
async function carregarProdutos() {
    try {
        const resposta = await fetch(`${API_URL}/produtos`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        const produtos = await resposta.json();

        listaProdutos.innerHTML = "";

        if (produtos.length === 0) {
            listaProdutos.innerHTML = "<p>Nenhum produto cadastrado.</p>";
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("produto-card");

            const imagem = produto.imagem
                ? `<img src="${produto.imagem}" alt="${produto.nome}">`
                : "";

            card.innerHTML = `
                ${imagem}
                <h3>${produto.nome}</h3>
                <p>${produto.descricao || "Produto sustentável"}</p>
                <p><strong>Material:</strong> ${produto.material || "Não informado"}</p>
                <p><strong>Tamanho:</strong> ${produto.tamanho || "Não informado"}</p>
                <p class="preco">
                    R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                </p>
                <p>Estoque: ${produto.estoque}</p>
            `;

            listaProdutos.appendChild(card);
        });

    } catch (erro) {
        console.error(erro);

        listaProdutos.innerHTML = `
            <p>Não foi possível carregar os produtos.
            Verifique se o servidor está funcionando.</p>
        `;
    }
}

// CARREGAR PRODUTOS AO ABRIR A PÁGINA
carregarProdutos();
