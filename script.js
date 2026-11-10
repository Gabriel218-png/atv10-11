const formulario = document.getElementById("form-media");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const nota1 = Number(document.getElementById("nota1").value);
    const nota2 = Number(document.getElementById("nota2").value);
    const nota3 = Number(document.getElementById("nota3").value);

    if (
        nome === "" ||
        ![nota1, nota2, nota3].every(nota =>
            Number.isFinite(nota) && nota >= 0 && nota <= 10
        )
    ) {
        resultado.textContent =
            "Digite um nome e notas válidas entre 0 e 10.";

        resultado.style.color = "red";
        return;
    }

    const media = (nota1 + nota2 + nota3) / 3;

    let situacao = "";

    if (media >= 7) {

        situacao = "Aprovado";

    } else if (media >= 5) {

        situacao = "Recuperação";

    } else {

        situacao = "Reprovado";

    }

    // Exibindo o resultado
    resultado.innerHTML =
        `Aluno: ${nome}<br>
         Média: ${media.toFixed(2)}<br>
         Situação: ${situacao}`;

    resultado.style.color = "green";

});

