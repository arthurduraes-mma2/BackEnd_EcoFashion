const API_URL = "http://localhost:3000";

// Dados do Carrossel de Destaques
const slides = [
  {
    titulo: "Vista o futuro com leveza.",
    desc: "Peças produzidas com algodão 100% orgânico e baixo impacto ambiental.",
    img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200"
  },
  {
    titulo: "Conforto natural em cada costura.",
    desc: "Camisetas, calças e vestidos confeccionados em linho puro e fibras sustentáveis.",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200"
  },
  {
    titulo: "Moda consciente para todos os dias.",
    desc: "Roupas atemporais com tingimento ecológico e produção ética.",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200"
  }
];

let slideAtual = 0;

function atualizarSlide() {
  const slideEl = document.getElementById("carrossel-slide");
  const tituloEl = document.getElementById("slide-titulo");
  const descEl = document.getElementById("slide-desc");
  const indicadorEl = document.getElementById("slide-indicador");

  if (!slideEl || !tituloEl || !descEl || !indicadorEl) return;

  const item = slides[slideAtual];
  tituloEl.textContent = item.titulo;
  descEl.textContent = item.desc;
  indicadorEl.textContent = `${slideAtual + 1} / ${slides.length}`;
  slideEl.style.backgroundImage = `linear-gradient(90deg, rgba(16, 44, 28, 0.92) 45%, rgba(16, 44, 28, 0.35)), url('${item.img}')`;
}

document.getElementById("btn-anterior")?.addEventListener("click", () => {
  slideAtual = (slideAtual - 1 + slides.length) % slides.length;
  atualizarSlide();
});

document.getElementById("btn-proximo")?.addEventListener("click", () => {
  slideAtual = (slideAtual + 1) % slides.length;
  atualizarSlide();
});

// Atualiza o contador de itens do carrinho no cabeçalho
function atualizarContadorCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const contador = document.getElementById("contador-carrinho");
  if (contador) contador.textContent = total;
}

// Carregar Produtos em Destaque da API
async function carregarProdutosDestaque() {
  const container = document.getElementById("lista-destaques");
  try {
    const resposta = await fetch(`${API_URL}/produtos`);
    const dados = await resposta.json();
    const produtos = Array.isArray(dados) ? dados : (dados.produtos || dados.data || []);

    container.innerHTML = "";

    produtos.slice(0, 4).forEach((prod) => {
      const precoFormatado = Number(prod.preco).toFixed(2).replace(".", ",");
      let imgUrl = prod.imagem || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";

      // Ajusta caminho relativo caso venha com "../img/" do banco
      if (imgUrl.startsWith("../img/")) {
        imgUrl = imgUrl.replace("../img/", "img/");
      }

      container.innerHTML += `
        <div class="card-produto">
          <img src="${imgUrl}" alt="${prod.nome}">
          <div class="card-corpo">
            <h3>${prod.nome}</h3>
            <p>${prod.descricao || "Produtos sustentáveis de alta qualidade."}</p>
            <div class="card-preco">★ R$ ${precoFormatado}</div>
            <a href="pages/produtos.html" class="btn-primario">Ver produtos</a>
          </div>
        </div>
      `;
    });
  } catch (erro) {
    container.innerHTML = `<p style="color:#5c6b62;">Não foi possível carregar os produtos. Verifique se o backend está a rodar na porta 3000.</p>`;
  }
}

atualizarSlide();
atualizarContadorCarrinho();
carregarProdutosDestaque();