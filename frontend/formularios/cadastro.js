const API_URL = "http://localhost:3000";
const formCadastro = document.getElementById("form-cadastro");
const mensagemCadastro = document.getElementById("mensagem-cadastro");

function exibirMensagem(texto, tipo) {
  mensagemCadastro.textContent = texto;
  mensagemCadastro.className = `alerta-form ${tipo}`;
}

formCadastro.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  mensagemCadastro.className = "alerta-form";

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
  const data_nascimento = document.getElementById("data_nascimento").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const endereco = {
    cep: document.getElementById("cep").value.trim(),
    rua: document.getElementById("rua").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    complemento: document.getElementById("complemento").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    estado: document.getElementById("estado").value.trim().toUpperCase()
  };

  try {
    const resposta = await fetch(`${API_URL}/cadastros`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        cpf,
        telefone,
        data_nascimento,
        email,
        senha
      })
    });

    const dados = await resposta.json().catch(() => ({}));

    if (resposta.ok) {
      // Salva o endereço vinculado ao e-mail do usuário para uso automático nas compras
      const enderecosSalvos = JSON.parse(localStorage.getItem("enderecosEcoFashion")) || {};
      enderecosSalvos[email.toLowerCase()] = { nome, ...endereco };
      localStorage.setItem("enderecosEcoFashion", JSON.stringify(enderecosSalvos));

      exibirMensagem("Cadastro realizado com sucesso! Indo para o login...", "sucesso");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } else {
      exibirMensagem(dados.erro || dados.mensagem || "Não foi possível cadastrar. Verifique os dados.", "erro");
    }
  } catch (erro) {
    exibirMensagem("Erro ao conectar com o servidor. Verifique se o backend está ligado.", "erro");
  }
});