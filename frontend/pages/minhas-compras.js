const listaCompras = document.getElementById("lista-compras");

function carregarCompras() {
  const compras = JSON.parse(localStorage.getItem("compras")) || [];

  if (compras.length === 0) {
    listaCompras.innerHTML = `
      <div class="sem-compras">
        <p>Você ainda não realizou nenhuma compra.</p>
        <a href="produtos.html" class="btn-explorar">Explorar Produtos</a>
      </div>
    `;
    return;
  }

  listaCompras.innerHTML = compras.map((pedido, index) => {
    const numeroPedido = pedido.id || (index + 1);
    const dataPedido = pedido.data || new Date().toLocaleDateString("pt-BR");
    const itensHtml = (pedido.itens || []).map((item) => {
      const subtotal = (Number(item.preco) * item.quantidade).toFixed(2).replace(".", ",");
      return `
        <div class="pedido-item-linha">
          <span>${item.quantidade}x ${item.nome}</span>
          <span>R$ ${subtotal}</span>
        </div>
      `;
    }).join("");

    const totalFormatado = Number(pedido.total || 0).toFixed(2).replace(".", ",");

    return `
      <div class="card-pedido">
        <div class="pedido-topo">
          <div>
            <span class="pedido-id">Pedido #${numeroPedido}</span>
            <span class="pedido-data"> • ${dataPedido}</span>
          </div>
          <span class="badge-status">${pedido.status || "Concluído"}</span>
        </div>
        <div class="pedido-itens">
          ${itensHtml}
        </div>
        <div class="pedido-rodape">
          <span>Total pago</span>
          <span>R$ ${totalFormatado}</span>
        </div>
      </div>
    `;
  }).join("");
}

carregarCompras();