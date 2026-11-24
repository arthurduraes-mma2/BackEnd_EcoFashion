const API_BASE = "http://localhost:3000";

function mostrarToast(mensagem) {
  let toast = document.querySelector(".toast-aviso");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-aviso";
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.classList.add("mostrar");

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2800);
}

async function buscarProdutos() {
  // Tenta primeiro /produtos (plural) e, se der 404, tenta /produto (singular)
  let resposta = await fetch(`${API_BASE}/produtos`);
  if (resposta.status === 404) {
    resposta = await fetch(`${API_BASE}/produto`);
  }
  if (!resposta.ok) {
    throw new Error(`Servidor respondeu com status ${resposta.status}`);
  }
  return await resposta.json();
}

async function carregarTodosProdutos() {
  const container = document.getElementById("lista-todos-produtos");

  try {
    const dados = await buscarProdutos();
    const produtos = Array.isArray(dados) ? dados : (dados.produtos || dados.data || []);

    container.innerHTML = "";

    if (produtos.length === 0) {
      container.innerHTML = `
        <div class="erro-aviso">
          O servidor conectou com sucesso, mas a tabela <strong>produtos</strong> no MySQL está vazia (0 itens). Rode os comandos <code>INSERT INTO produtos</code> no MySQL Workbench.
        </div>`;
      return;
    }

    produtos.forEach((prod) => {
      const precoFormatado = Number(prod.preco).toFixed(2).replace(".", ",");
      const imgUrl = prod.imagem || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";

      container.innerHTML += `
        <div class="card-produto">
          <img src="${imgUrl}" alt="${prod.nome}">
          <div class="card-corpo">
            <h3>${prod.nome}</h3>
            <p>${prod.descricao || "Produto sustentável de alta qualidade."}</p>
            <div class="card-preco">R$ ${precoFormatado}</div>
            <button class="btn-primario" onclick="adicionarAoCarrinho(${prod.id}, '${prod.nome}', ${prod.preco})">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      `;
    });
  } catch (erro) {
    container.innerHTML = `
      <div class="erro-aviso">
        <strong>Falha na conexão com o backend:</strong> ${erro.message}<br>
        Verifique se o servidor está rodando na porta 3000 e se o CORS está ativado no Express.
      </div>`;
  }
}

function adicionarAoCarrinho(id, nome, preco) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const existente = carrinho.find((item) => item.id === id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarContador();
  mostrarToast(`🌿 ${nome} adicionado ao carrinho!`);
}

function atualizarContador() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const contador = document.getElementById("contador-carrinho");
  if (contador) contador.textContent = total;
}

atualizarContador();
carregarTodosProdutos();