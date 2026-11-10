const inputProduto = document.getElementById('nomeProduto');
const inputValor = document.getElementById('valorUnitario');
const inputQtd = document.getElementById('quantidade');
const inputDesconto = document.getElementById('desconto');
const btnCalcular = document.getElementById('btnCalcular');
const mensagemErro = document.getElementById('mensagemErro');
const divResultado = document.getElementById('resultado');

const resProduto = document.getElementById('resProduto');
const resSubtotal = document.getElementById('resSubtotal');
const resEconomia = document.getElementById('resEconomia');
const resTotal = document.getElementById('resTotal');

function calcularDesconto(subtotal, percentualDesconto) {
    return subtotal * (percentualDesconto / 100);
}

const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

btnCalcular.addEventListener('click', function() {
    
    mensagemErro.textContent = '';
    divResultado.classList.add('oculto');

    const nomeProduto = inputProduto.value.trim();
    const valorUnitario = parseFloat(inputValor.value);
    const quantidade = parseInt(inputQtd.value);
    const percentualDesconto = parseFloat(inputDesconto.value);

    if (!nomeProduto) {
        mensagemErro.textContent = 'Erro: O nome do produto é obrigatório.';
        return;
    }
    
    if (isNaN(valorUnitario) || valorUnitario <= 0) {
        mensagemErro.textContent = 'Erro: Insira um valor unitário válido e maior que zero.';
        return;
    }

    if (isNaN(quantidade) || quantidade < 1) {
        mensagemErro.textContent = 'Erro: A quantidade deve ser no mínimo 1.';
        return;
    }

    if (isNaN(percentualDesconto) || percentualDesconto < 0 || percentualDesconto > 100) {
        mensagemErro.textContent = 'Erro: O desconto deve estar entre 0% e 100%.';
        return;
    }

    const subtotal = valorUnitario * quantidade;
    const valorEconomizado = calcularDesconto(subtotal, percentualDesconto);
    const totalAPagar = subtotal - valorEconomizado;

    resProduto.textContent = nomeProduto;
    resSubtotal.textContent = formatarMoeda(subtotal);
    resEconomia.textContent = formatarMoeda(valorEconomizado);
    resTotal.textContent = formatarMoeda(totalAPagar);

    divResultado.classList.remove('oculto');
});