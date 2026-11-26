const listaCompras = document.getElementById("lista-compras");

// Atualiza o menu superior com o nome do usuário logado
function verificarLoginMenu() {
  const usuarioSalvo = localStorage.getItem("usuarioEcoFashion");
  const linkEntrar = document.querySelector('a[href="../formularios/login.html"]');
  const btnSair = document.getElementById("btn-sair");

  if (usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);
    const nomeExibicao = usuario.nome || usuario.name || usuario.email.split("@")[0];

    if (linkEntrar) {
      linkEntrar.textContent = `Olá, ${nomeExibicao}`;
      linkEntrar.href = "minhas-compras.html";
      linkEntrar.style.color = "#eab308";
      linkEntrar.style.fontWeight = "bold";
    }

    if (btnSair) {
      btnSair.style.display = "inline-block";
      btnSair.addEventListener("click", () => {
        localStorage.removeItem("usuarioEcoFashion");
        localStorage.removeItem("tokenEcoFashion");
        window.location.href = "../index.html";
      });
    }
  } else if (btnSair) {
    btnSair.style.display = "none";
  }
}

function carregarCompras() {
  const todasCompras = JSON.parse(localStorage.getItem("compras")) || [];
  const usuarioSalvo = localStorage.getItem("usuarioEcoFashion");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const compras = usuario
    ? todasCompras.filter((p) => !p.usuarioEmail || p.usuarioEmail === usuario.email)
    : todasCompras;

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

    let enderecoHtml = "";
    if (pedido.endereco && pedido.endereco.rua) {
      const e = pedido.endereco;
      const comp = e.complemento ? ` (${e.complemento})` : "";
      enderecoHtml = `
        <div style="font-size: 0.85rem; color: #475569; background: #f8faf9; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px;">
          <strong>Entrega:</strong> ${e.rua}, ${e.numero}${comp} — ${e.bairro}, ${e.cidade}/${e.estado} (CEP: ${e.cep})
        </div>
      `;
    }

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
        ${enderecoHtml}
        <div class="pedido-rodape">
          <span>Total pago (${pedido.pagamento || "PIX"})</span>
          <span>R$ ${totalFormatado}</span>
        </div>
      </div>
    `;
  }).join("");
}

verificarLoginMenu();
carregarCompras();