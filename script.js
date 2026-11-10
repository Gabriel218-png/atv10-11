
const alunos = [];

const formAluno = document.getElementById('formAluno');
const inputMatricula = document.getElementById('matricula');
const inputNome = document.getElementById('nome');
const inputIdade = document.getElementById('idade');
const inputCurso = document.getElementById('curso');
const mensagemErro = document.getElementById('mensagemErro');
const listaAlunos = document.getElementById('listaAlunos');
const totalAlunos = document.getElementById('totalAlunos');

function renderizarAlunos() {
    listaAlunos.innerHTML = '';
    
    alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.className = 'item-aluno';
        li.innerHTML = `<strong>[${aluno.matricula}]</strong> ${aluno.nome} - ${aluno.idade} anos | Curso: ${aluno.curso}`;
        listaAlunos.appendChild(li);
    });

    totalAlunos.textContent = `Total: ${alunos.length}`;
}

formAluno.addEventListener('submit', function(e) {
    e.preventDefault();
    mensagemErro.textContent = '';

    const matricula = inputMatricula.value.trim();
    const nome = inputNome.value.trim();
    const idade = parseInt(inputIdade.value);
    const curso = inputCurso.value.trim();

    const matriculaExiste = alunos.some(aluno => aluno.matricula === matricula);
    if (matriculaExiste) {
        mensagemErro.textContent = 'Erro: Já existe um aluno cadastrado com esta matrícula!';
        return;
    }

    const novoAluno = { matricula, nome, idade, curso };

    alunos.push(novoAluno);

    renderizarAlunos();
    formAluno.reset();
    inputMatricula.focus();
});