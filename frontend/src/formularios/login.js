
const formulario = document.getElementById("form-login");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (email !== "" && senha !== "") {

        alert("Login realizado com sucesso!");

    }

});
