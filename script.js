const inputNumero = document.getElementById('numero');
const btnGerar = document.getElementById('btnGerar');
const btnLimpar = document.getElementById('btnLimpar');
const mensagemErro = document.getElementById('mensagemErro');
const divResultado = document.getElementById('resultado');

btnGerar.addEventListener('click', function() {
   
    divResultado.innerHTML = '';
    mensagemErro.textContent = '';

    const numero = parseInt(inputNumero.value);

    if (isNaN(numero) || numero < 1 || numero > 20) {
        mensagemErro.textContent = 'Erro: Digite um número válido entre 1 e 20.';
        return; 
    }

    for (let i = 1; i <= 10; i++) {
        const resultado = numero * i;
        
        const linha = document.createElement('div');
        linha.className = 'linha-tabuada';
        linha.textContent = `${numero} x ${i} = ${resultado}`;
        
        divResultado.appendChild(linha);
    }
});

btnLimpar.addEventListener('click', function() {
    inputNumero.value = '';
    divResultado.innerHTML = '';
    mensagemErro.textContent = '';
    inputNumero.focus(); 
});