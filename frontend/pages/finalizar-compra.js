let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const textoTotal = document.getElementById("texto-total");

// Soma o valor total do pedido
let total = 0;
for (let i = 0; i < carrinho.length; i++) {
  total += carrinho[i].preco * carrinho[i].quantidade;
}

if (textoTotal) {
  textoTotal.textContent = `Total a pagar: R$ ${total.toFixed(2).replace(".", ",")}`;
}

function confirmarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let forma = document.getElementById("forma-pagamento").value;
  let dataHoje = new Date().toLocaleDateString("pt-BR");
  let area = document.getElementById("area-pagamento");

  // Identifica o usuário logado (se houver)
  const usuarioSalvo = localStorage.getItem("usuarioEcoFashion");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  // Lê as compras anteriores e cria o novo pedido no formato esperado pelo minhas-compras.js
  const comprasAnteriores = JSON.parse(localStorage.getItem("compras")) || [];
  const novoPedido = {
    id: Math.floor(1000 + Math.random() * 9000),
    usuarioEmail: usuario ? usuario.email : "visitante",
    data: dataHoje,
    pagamento: forma,
    status: "Concluído",
    itens: carrinho,
    total: total
  };

  comprasAnteriores.unshift(novoPedido);
  localStorage.setItem("compras", JSON.stringify(comprasAnteriores));

  // Gera o comprovante / Nota Fiscal na tela
  area.innerHTML = `
    <h2 style="color: var(--cor-principal);">✅ Compra Realizada!</h2>
    <p><strong>Pedido #${novoPedido.id}</strong></p>
    <p><strong>Data:</strong> ${dataHoje}</p>
    <p><strong>Pagamento:</strong> ${forma}</p>
    <p><strong>Valor Pago:</strong> R$ ${total.toFixed(2).replace(".", ",")}</p>
    <hr>
    <p>Obrigado por comprar na EcoFashion!</p>
    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
      <button class="btn" onclick="verMinhasCompras()">Ver Minhas Compras</button>
      <button class="btn" onclick="voltarInicio()">Voltar para a Loja</button>
    </div>
  `;

  // Esvazia o carrinho
  localStorage.removeItem("carrinho");
}

function verMinhasCompras() {
  window.location.href = "minhas-compras.html";
}

function voltarInicio() {
  window.location.href = "../index.html";
}