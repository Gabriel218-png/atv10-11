
let estudantes = JSON.parse(localStorage.getItem('q7_estudantes')) || [];
let registrosFrequencia = JSON.parse(localStorage.getItem('q7_frequencia')) || [];

const formEstudante = document.getElementById('formEstudante');
const formFrequencia = document.getElementById('formFrequencia');
const selectAluno = document.getElementById('selectAluno');
const mensagemErro = document.getElementById('mensagemErro');
const secaoAlertas = document.getElementById('secaoAlertas');
const listaAlertas = document.getElementById('listaAlertas');
const tabelaHistorico = document.getElementById('tabelaHistorico');

function salvarDados() {
    localStorage.setItem('q7_estudantes', JSON.stringify(estudantes));
    localStorage.setItem('q7_frequencia', JSON.stringify(registrosFrequencia));
}

function atualizarSelectAlunos() {
    selectAluno.innerHTML = '<option value="">Selecione o Estudante</option>';
    estudantes.forEach(est => {
        const option = document.createElement('option');
        option.value = est.matricula;
        option.textContent = `${est.nome} (${est.turma})`;
        selectAluno.appendChild(option);
    });
}

function verificarAlertasPedagogicos() {
    listaAlertas.innerHTML = '';
    let temAlerta = false;

    estudantes.forEach(est => {
     
        const registros = registrosFrequencia
            .filter(r => r.matricula === est.matricula)
            .sort((a, b) => new Date(a.data) - new Date(b.data));

        let faltasConsecutivas = 0;
        let maxConsecutivas = 0;

        registros.forEach(r => {
            if (r.status === 'FNJ') {
                faltasConsecutivas++;
                if (faltasConsecutivas > maxConsecutivas) maxConsecutivas = faltasConsecutivas;
            } else {
                faltasConsecutivas = 0;
            }
        });

        if (maxConsecutivas >= 3) {
            temAlerta = true;
            const li = document.createElement('li');
            li.textContent = `🚨 ${est.nome} (Matrícula: ${est.matricula} | Turma: ${est.turma}) possui ${maxConsecutivas} faltas NÃO justificadas consecutivas!`;
            listaAlertas.appendChild(li);
        }
    });

    if (temAlerta) {
        secaoAlertas.classList.remove('oculto');
    } else {
        secaoAlertas.classList.add('oculto');
    }
}

function renderizarRelatorio() {
    tabelaHistorico.innerHTML = '';

    estudantes.forEach(est => {
        const registros = registrosFrequencia
            .filter(r => r.matricula === est.matricula)
            .sort((a, b) => new Date(a.data) - new Date(b.data));

        const presencas = registros.filter(r => r.status === 'P').length;
        const faltasJ = registros.filter(r => r.status === 'FJ').length;
        const faltasNJ = registros.filter(r => r.status === 'FNJ').length;

        const historicoTags = registros.slice(-5).map(r => {
            const dataFmt = r.data.split('-').reverse().slice(0, 2).join('/');
            return `<span class="tag tag-${r.status.toLowerCase()}">${dataFmt}: ${r.status}</span>`;
        }).join('');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${est.matricula}</td>
            <td>${est.nome}</td>
            <td>${est.turma}</td>
            <td>${presencas}</td>
            <td>${faltasJ}</td>
            <td>${faltasNJ}</td>
            <td>${historicoTags || 'Sem registros'}</td>
        `;
        tabelaHistorico.appendChild(tr);
    });

    verificarAlertasPedagogicos();
}

formEstudante.addEventListener('submit', function(e) {
    e.preventDefault();
    mensagemErro.textContent = '';
    
    const matricula = document.getElementById('matricula').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const turma = document.getElementById('turma').value.trim();
    const curso = document.getElementById('curso').value.trim();

    if (estudantes.some(e => e.matricula === matricula)) {
        mensagemErro.textContent = 'Erro: Matrícula já cadastrada!';
        return;
    }

    estudantes.push({ matricula, nome, turma, curso });
    salvarDados();
    atualizarSelectAlunos();
    renderizarRelatorio();
    formEstudante.reset();
});

formFrequencia.addEventListener('submit', function(e) {
    e.preventDefault();
    mensagemErro.textContent = '';

    const matricula = selectAluno.value;
    const data = document.getElementById('dataRegistro').value;
    const status = document.getElementById('statusFrequencia').value;

    const jaRegistrado = registrosFrequencia.some(r => r.matricula === matricula && r.data === data);
    if (jaRegistrado) {
        mensagemErro.textContent = 'Erro: Já existe um registro de frequência para este estudante nesta data!';
        return;
    }

    registrosFrequencia.push({ matricula, data, status });
    salvarDados();
    renderizarRelatorio();
    formFrequencia.reset();
});

// Inicialização
atualizarSelectAlunos();
renderizarRelatorio();