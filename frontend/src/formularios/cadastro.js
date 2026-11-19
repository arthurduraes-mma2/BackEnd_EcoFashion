
const formulario = document.getElementById("form-cadastro");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    alert("Cadastro realizado! Bem-vindo, " + nome);

    formulario.reset();

});
