let alunosDash = JSON.parse(localStorage.getItem('q9_alunos')) || [];

const formDados = document.getElementById('formDados');
const filtroTurma = document.getElementById('filtroTurma');
const mediaGeralEl = document.getElementById('mediaGeral');
const freqMediaEl = document.getElementById('freqMedia');

const barraAprovados = document.getElementById('barraAprovados');
const barraRecuperacao = document.getElementById('barraRecuperacao');
const barraReprovados = document.getElementById('barraReprovados');

function salvarLocalStorage() {
    localStorage.setItem('q9_alunos', JSON.stringify(alunosDash));
}

function popularFiltroTurmas() {
    const turmaAtual = filtroTurma.value;
    const turmas = [...new Set(alunosDash.map(a => a.turma))];
    
    filtroTurma.innerHTML = '<option value="todas">Todas as Turmas</option>';
    turmas.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = `Turma ${t}`;
        filtroTurma.appendChild(option);
    });

    filtroTurma.value = turmaAtual;
}

function atualizarDashboard() {
    const turmaSelecionada = filtroTurma.value;
    
    const alunosFiltrados = alunosDash.filter(a => 
        turmaSelecionada === 'todas' || a.turma === turmaSelecionada
    );

    const total = alunosFiltrados.length;

    if (total === 0) {
        mediaGeralEl.textContent = '0.0';
        freqMediaEl.textContent = '0%';
        atualizarBarra(barraAprovados, 0);
        atualizarBarra(barraRecuperacao, 0);
        atualizarBarra(barraReprovados, 0);
        return;
    }

    const somaNotas = alunosFiltrados.reduce((acc, a) => acc + a.nota, 0);
    const mediaGeral = (somaNotas / total).toFixed(1);
    mediaGeralEl.textContent = mediaGeral;

    const somaFreq = alunosFiltrados.reduce((acc, a) => acc + a.frequencia, 0);
    const freqMedia = (somaFreq / total).toFixed(1);
    freqMediaEl.textContent = `${freqMedia}%`;

    const aprovados = alunosFiltrados.filter(a => a.nota >= 7.0).length;
    const recuperacao = alunosFiltrados.filter(a => a.nota >= 5.0 && a.nota < 7.0).length;
    const reprovados = alunosFiltrados.filter(a => a.nota < 5.0).length;

    const pctAprovados = Math.round((aprovados / total) * 100);
    const pctRecuperacao = Math.round((recuperacao / total) * 100);
    const pctReprovados = Math.round((reprovados / total) * 100);

    atualizarBarra(barraAprovados, pctAprovados);
    atualizarBarra(barraRecuperacao, pctRecuperacao);
    atualizarBarra(barraReprovados, pctReprovados);
}

function atualizarBarra(elemento, percentual) {
    elemento.style.width = `${percentual}%`;
    elemento.textContent = `${percentual}%`;
}

formDados.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const turma = document.getElementById('turma').value.trim().toUpperCase();
    const nota = parseFloat(document.getElementById('nota').value);
    const frequencia = parseFloat(document.getElementById('frequencia').value);

    alunosDash.push({ nome, turma, nota, frequencia });
    salvarLocalStorage();
    popularFiltroTurmas();
    atualizarDashboard();
    formDados.reset();
});

filtroTurma.addEventListener('change', atualizarDashboard);

// Inicialização
popularFiltroTurmas();
atualizarDashboard();