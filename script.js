
const estoque = [];

const formProduto = document.getElementById('formProduto');
const inputCodigo = document.getElementById('codigo');
const inputNome = document.getElementById('nomeProduto');
const inputQtd = document.getElementById('quantidade');
const inputPreco = document.getElementById('preco');
const mensagemErro = document.getElementById('mensagemErro');
const valorTotalEstoque = document.getElementById('valorTotalEstoque');
const listaEstoque = document.getElementById('listaEstoque');

function calcularTotalEstoque() {
    const total = estoque.reduce((acc, prod) => acc + (prod.quantidade * prod.preco), 0);
    valorTotalEstoque.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function entradaMercadoria(codigo) {
    mensagemErro.textContent = '';
    const produto = estoque.find(p => p.codigo === codigo);
    if (produto) {
        produto.quantidade += 1;
        atualizarInterface();
    }
}

function saídaMercadoria(codigo) {
    mensagemErro.textContent = '';
    const produto = estoque.find(p => p.codigo === codigo);
    
    if (produto) {

        if (produto.quantidade <= 0) {
            mensagemErro.textContent = `Erro: Estoque insuficiente para saída do produto "${produto.nome}"!`;
            return;
        }
        produto.quantidade -= 1;
        atualizarInterface();
    }
}

function atualizarInterface() {
    listaEstoque.innerHTML = '';

    estoque.forEach(prod => {
        const li = document.createElement('li');
       
        const eEstoqueBaixo = prod.quantidade < 5;
        li.className = `item-produto ${eEstoqueBaixo ? 'estoque-baixo' : ''}`;

        const totalItem = (prod.quantidade * prod.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const precoUnit = prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        li.innerHTML = `
            <div class="info-prod">
                <strong>[${prod.codigo}] ${prod.nome}</strong><br>
                Qtd: <strong>${prod.quantidade}</strong> | R$: ${precoUnit} | Subtotal: ${totalItem}
                ${eEstoqueBaixo ? '<span class="alerta-baixo">⚠ Estoque Baixo (Menos de 5 unidades)</span>' : ''}
            </div>
            <div class="acoes-prod">
                <button class="btn btn-entrar" onclick="entradaMercadoria('${prod.codigo}')">+1 Entrar</button>
                <button class="btn btn-sair" onclick="saídaMercadoria('${prod.codigo}')">-1 Sair</button>
            </div>
        `;
        listaEstoque.appendChild(li);
    });

    calcularTotalEstoque();
}

formProduto.addEventListener('submit', function(e) {
    e.preventDefault();
    mensagemErro.textContent = '';

    const codigo = inputCodigo.value.trim();
    const nome = inputNome.value.trim();
    const quantidade = parseInt(inputQtd.value);
    const preco = parseFloat(inputPreco.value);

    const prodExistente = estoque.find(p => p.codigo === codigo);
    if (prodExistente) {
        mensagemErro.textContent = 'Erro: Já existe um produto cadastrado com este código!';
        return;
    }

    estoque.push({ codigo, nome, quantidade, preco });

    formProduto.reset();
    inputCodigo.focus();
    atualizarInterface();
});