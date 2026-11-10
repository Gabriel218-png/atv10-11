
const alunos = [
    { matricula: '101', nome: 'Ana Clara Souza', idade: 21, curso: 'Engenharia de Software' },
    { matricula: '102', nome: 'Carlos Eduardo', idade: 23, curso: 'Ciência da Computação' },
    { matricula: '103', nome: 'Beatriz Ramos', idade: 20, curso: 'Engenharia de Software' },
    { matricula: '104', nome: 'Daniel Oliveira', idade: 22, curso: 'Sistemas de Informação' },
    { matricula: '105', nome: 'Ana Julia Pereira', idade: 19, curso: 'Ciência da Computação' }
];

const buscaNome = document.getElementById('buscaNome');
const filtroCurso = document.getElementById('filtroCurso');
const listaResultados = document.getElementById('listaResultados');
const qtdResultados = document.getElementById('qtdResultados');
const mensagemVazia = document.getElementById('mensagemVazia');

const popularCursos = () => {
    const cursosUnicos = [...new Set(alunos.map(aluno => aluno.curso))];
    cursosUnicos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        filtroCurso.appendChild(option);
    });
};

const aplicarFiltros = () => {
    const termoNome = buscaNome.value.toLowerCase().trim();
    const cursoSelecionado = filtroCurso.value;

    const resultados = alunos.filter(aluno => {
        const bateNome = aluno.nome.toLowerCase().includes(termoNome);
        const bateCurso = cursoSelecionado === '' || aluno.curso === cursoSelecionado;
        return bateNome && bateCurso;
    });

    renderizarResultados(resultados);
};

const renderizarResultados = (lista) => {
    listaResultados.innerHTML = '';
    qtdResultados.textContent = `${lista.length} encontrado(s)`;

    if (lista.length === 0) {
        mensagemVazia.classList.remove('oculto');
        return;
    }

    mensagemVazia.classList.add('oculto');
    
    const itensHTML = lista.map(aluno => `
        <li class="item-aluno">
            <strong>[${aluno.matricula}]</strong> ${aluno.nome} - ${aluno.idade} anos 
            <br><small>Curso: ${aluno.curso}</small>
        </li>
    `).join('');

    listaResultados.innerHTML = itensHTML;
};

buscaNome.addEventListener('input', aplicarFiltros);
filtroCurso.addEventListener('change', aplicarFiltros);

popularCursos();
aplicarFiltros();