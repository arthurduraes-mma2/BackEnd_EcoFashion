let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
const textoTotal = document.getElementById("texto-total");

// Soma o valor total do pedido
let total = 0;
for (let i = 0; i < carrinho.length; i++) {
  total += carrinho[i].preco * carrinho[i].quantidade;
}

textoTotal.textContent = `Total a pagar: R$ ${total.toFixed(2).replace(".", ",")}`;

function confirmarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let forma = document.getElementById("forma-pagamento").value;
  let dataHoje = new Date().toLocaleDateString("pt-BR");
  let area = document.getElementById("area-pagamento");

  // Gera o comprovante / Nota Fiscal na tela
  area.innerHTML = `
    <h2 style="color: var(--cor-principal);">✅ Compra Realizada!</h2>
    <p><strong>Comprovante de Venda</strong></p>
    <p><strong>Data:</strong> ${dataHoje}</p>
    <p><strong>Pagamento:</strong> ${forma}</p>
    <p><strong>Valor Pago:</strong> R$ ${total.toFixed(2).replace(".", ",")}</p>
    <hr>
    <p>Obrigado por comprar na EcoLoja!</p>
    <button class="btn" onclick="voltarInicio()">Voltar para a Loja</button>
  `;

  // Esvazia o carrinho
  localStorage.removeItem("carrinho");
}

function voltarInicio() {
  window.location.href = "../index.html";
}