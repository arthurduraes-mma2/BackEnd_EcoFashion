const API_URL = "http://localhost:3000";
const formLogin = document.getElementById("form-login");
const mensagemLogin = document.getElementById("mensagem-login");

function exibirMensagem(texto, tipo) {
  mensagemLogin.textContent = texto;
  mensagemLogin.className = `alerta-form ${tipo}`;
}

formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  mensagemLogin.className = "alerta-form";

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json().catch(() => ({}));

    if (resposta.ok) {
      localStorage.setItem("usuario", JSON.stringify(dados));
      exibirMensagem("Login realizado com sucesso! Redirecionando...", "sucesso");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1000);
    } else {
      exibirMensagem(dados.mensagem || dados.erro || "E-mail ou senha incorretos.", "erro");
    }
  } catch (erro) {
    exibirMensagem("Erro ao conectar com o servidor. Verifique se o backend está ligado.", "erro");
  }
});