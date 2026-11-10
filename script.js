let tarefas = JSON.parse(localStorage.getItem('q8_tarefas')) || [];

const formTarefa = document.getElementById('formTarefa');
const tarefaId = document.getElementById('tarefaId');
const inputTitulo = document.getElementById('titulo');
const inputDescricao = document.getElementById('descricao');
const selectPrioridade = document.getElementById('prioridade');
const inputPrazo = document.getElementById('prazo');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const tituloForm = document.getElementById('tituloForm');

const filtroStatus = document.getElementById('filtroStatus');
const ordemCampo = document.getElementById('ordemCampo');
const listaTarefas = document.getElementById('listaTarefas');

function salvarLocalStorage() {
    localStorage.setItem('q8_tarefas', JSON.stringify(tarefas));
}

function calcularStatus(tarefa) {
    if (tarefa.concluida) return 'concluida';
    
    const hoje = new Date().toISOString().split('T')[0];
    if (tarefa.prazo < hoje) return 'atrasada';
    
    return 'pendente';
}

function atualizarIndicadores() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = tarefas.filter(t => calcularStatus(t) === 'pendente').length;
    const atrasadas = tarefas.filter(t => calcularStatus(t) === 'atrasada').length;

    document.getElementById('indTotal').textContent = total;
    document.getElementById('indConcluidas').textContent = concluidas;
    document.getElementById('indPendentes').textContent = pendentes;
    document.getElementById('indAtrasadas').textContent = atrasadas;
}

function renderizarTarefas() {
    listaTarefas.innerHTML = '';
    const statusFiltro = filtroStatus.value;
    const campoOrdem = ordemCampo.value;

    let tarefasFiltradas = tarefas.filter(t => {
        const st = calcularStatus(t);
        if (statusFiltro === 'todas') return true;
        if (statusFiltro === 'concluidas') return t.concluida;
        if (statusFiltro === 'pendentes') return st === 'pendente';
        if (statusFiltro === 'atrasadas') return st === 'atrasada';
    });

    tarefasFiltradas.sort((a, b) => {
        if (campoOrdem === 'prazo') {
            return new Date(a.prazo) - new Date(b.prazo);
        } else if (campoOrdem === 'prioridade') {
            return b.prioridade - a.prioridade; 
        }
    });

    const prioTexto = { 1: 'Baixa', 2: 'Média', 3: 'Alta' };

    tarefasFiltradas.forEach(t => {
        const status = calcularStatus(t);
        const li = document.createElement('li');
        li.className = `item-tarefa ${status}`;

        const prazoFmt = t.prazo.split('-').reverse().join('/');

        li.innerHTML = `
            <div class="info-t">
                <h4 class="titulo-t">${t.titulo}</h4>
                <p>${t.descricao}</p>
                <div class="tags-t">
                    <span class="tag-prio">Prioridade: ${prioTexto[t.prioridade]}</span>
                    <span class="tag-prazo">Prazo: ${prazoFmt}</span>
                </div>
            </div>
            <div class="acoes-t">
                <button class="btn-sm btn-check" onclick="alternarConcluida('${t.id}')">${t.concluida ? 'Desfazer' : 'Concluir'}</button>
                <button class="btn-sm btn-edit" onclick="editarTarefa('${t.id}')">Editar</button>
                <button class="btn-sm btn-del" onclick="excluirTarefa('${t.id}')">Excluir</button>
            </div>
        `;
        listaTarefas.appendChild(li);
    });

    atualizarIndicadores();
}

formTarefa.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = tarefaId.value;
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();
    const prioridade = parseInt(selectPrioridade.value);
    const prazo = inputPrazo.value;

    if (id) {
        
        const index = tarefas.findIndex(t => t.id === id);
        if (index !== -1) {
            tarefas[index] = { ...tarefas[index], titulo, descricao, prioridade, prazo };
        }
    } else {
        
        const novaTarefa = {
            id: Date.now().toString(),
            titulo,
            descricao,
            prioridade,
            prazo,
            concluida: false
        };
        tarefas.push(novaTarefa);
    }

    salvarLocalStorage();
    resetarFormulario();
    renderizarTarefas();
});

function alternarConcluida(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarLocalStorage();
        renderizarTarefas();
    }
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefaId.value = tarefa.id;
        inputTitulo.value = tarefa.titulo;
        inputDescricao.value = tarefa.descricao;
        selectPrioridade.value = tarefa.prioridade;
        inputPrazo.value = tarefa.prazo;
        
        tituloForm.textContent = 'Editar Tarefa';
        btnSalvar.textContent = 'Atualizar Tarefa';
        btnCancelar.classList.remove('oculto');
    }
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvarLocalStorage();
    renderizarTarefas();
}

function resetarFormulario() {
    tarefaId.value = '';
    formTarefa.reset();
    tituloForm.textContent = 'Nova Tarefa';
    btnSalvar.textContent = 'Salvar Tarefa';
    btnCancelar.classList.add('oculto');
}

btnCancelar.addEventListener('click', resetarFormulario);
filtroStatus.addEventListener('change', renderizarTarefas);
ordemCampo.addEventListener('change', renderizarTarefas);

// Inicializar
renderizarTarefas();