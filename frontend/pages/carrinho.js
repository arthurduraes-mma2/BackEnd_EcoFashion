const listaItens = document.getElementById("lista-itens");
const precoTotal = document.getElementById("preco-total");

function mostrarToast(mensagem) {
  let toast = document.querySelector(".toast-aviso");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast-aviso";
    document.body.appendChild(toast);
  }
  toast.textContent = mensagem;
  toast.classList.add("mostrar");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2500);
}

function mostrarCarrinho() {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  listaItens.innerHTML = "";
  let soma = 0;

  if (carrinho.length === 0) {
    listaItens.innerHTML = "<p>Seu carrinho está vazio.</p>";
    precoTotal.textContent = "0,00";
    return;
  }

  for (let i = 0; i < carrinho.length; i++) {
    let item = carrinho[i];
    soma += item.preco * item.quantidade;

    listaItens.innerHTML += `
      <div class="item">
        <div>
          <h4>${item.nome}</h4>
          <p>Unitário: R$ ${Number(item.preco).toFixed(2).replace(".", ",")}</p>
        </div>
        <div class="botoes-qtd">
          <button class="btn-mini" onclick="mudarQtd(${i}, -1)">-</button>
          <span>${item.quantidade}</span>
          <button class="btn-mini" onclick="mudarQtd(${i}, 1)">+</button>
          <button class="btn-mini btn-excluir" onclick="excluirItem(${i})">Excluir</button>
        </div>
      </div>
    `;
  }

  precoTotal.textContent = soma.toFixed(2).replace(".", ",");
}

function mudarQtd(posicao, valor) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  let item = carrinho[posicao];

  if (item.quantidade + valor > item.estoque) {
    mostrarToast("Não há mais unidades em estoque!");
    return;
  }

  item.quantidade += valor;

  if (item.quantidade <= 0) {
    carrinho.splice(posicao, 1);
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarCarrinho();
}

function excluirItem(posicao) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho.splice(posicao, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  mostrarCarrinho();
}

function irParaPagamento() {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  if (carrinho.length === 0) {
    mostrarToast("Seu carrinho está vazio!");
    return;
  }
  window.location.href = "finalizar-compra.html";
}

mostrarCarrinho();