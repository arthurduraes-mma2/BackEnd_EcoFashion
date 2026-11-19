
const formulario = document.getElementById("form-compra");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const endereco = document.getElementById("endereco").value;
    const pagamento = document.getElementById("pagamento").value;

    alert("Compra confirmada! Obrigado pela compra, " + nome + "!");

    formulario.reset();

});
