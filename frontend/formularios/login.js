document.getElementById('form-login').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const caixaMensagem = document.getElementById('mensagem-login');

  caixaMensagem.className = 'alerta-form';
  caixaMensagem.textContent = '';

  try {
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      caixaMensagem.textContent = dados.mensagem || dados.erro || 'E-mail ou senha inválidos.';
      caixaMensagem.className = 'alerta-form erro';
      return;
    }

    // Salva os dados do usuário no navegador
    const dadosUsuario = dados.usuario || dados.user || {
      email: email,
      nome: dados.nome || email.split('@')[0]
    };

    localStorage.setItem('usuarioEcoFashion', JSON.stringify(dadosUsuario));

    if (dados.token) {
      localStorage.setItem('tokenEcoFashion', dados.token);
    }

    caixaMensagem.textContent = 'Login realizado com sucesso! Redirecionando...';
    caixaMensagem.className = 'alerta-form sucesso';

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 800);

  } catch (erro) {
    console.error('Erro na requisição:', erro);
    caixaMensagem.textContent = 'Erro ao conectar com o servidor. Verifique se o backend está ligado.';
    caixaMensagem.className = 'alerta-form erro';
  }
});