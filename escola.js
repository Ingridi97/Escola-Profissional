const cursos = [];
const clientes = [];
const vendas = [];

document.addEventListener('DOMContentLoaded', () => {
    // Seção de Cadastro de Curso
    document.getElementById('cursoForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtendo valores do formulário de cadastro de curso
        const nome = document.getElementById('cursoNome').value;
        const carga = document.getElementById('cursoCarga').value;
        const valor = document.getElementById('cursoValor').value;

        // Verificando se o curso já existe
        if (cursos.some(curso => curso.nome === nome)) {
            alert("Este curso já foi cadastrado.");
            return;
        }

        // Adicionando curso
        const curso = { nome, carga, valor };
        cursos.push(curso);
        
        // Atualizar as opções de cursos na seleção de cursos
        atualizarSelecaoCursos();
        atualizarSelecaoCursosVenda();
    });

    // Seção de Cadastro de Cliente
    document.getElementById('clienteForm').addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtendo valores do formulário de cadastro de cliente
        const nome = document.getElementById('clienteNome').value;
        const cpf = document.getElementById('clienteCPF').value;

        // Verificando se o CPF já está cadastrado
        if (clientes.some(cliente => cliente.cpf === cpf)) {
            alert("Este CPF já está cadastrado.");
            return;
        }

        // Adicionando cliente
        const cliente = { nome, cpf };
        clientes.push(cliente);
        atualizarClientes();
        atualizarSelecaoClientes();
    });

    // Registrar Venda
    document.getElementById('vendaForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const clienteIndex = document.getElementById('clienteSelect').value;
        const cursoIndex = document.getElementById('cursoSelect').value;

        if (clienteIndex === "" || cursoIndex === "") {
            alert("Selecione um cliente e um curso antes de registrar a venda.");
            return;
        }

        const venda = {
            cliente: clientes[clienteIndex].nome,
            curso: cursos[cursoIndex].nome,
        };
        vendas.push(venda);
        atualizarVendas();
        exibirDetalhesVenda(clienteIndex, cursoIndex);
    });

    // Atualizar as opções de cursos na seleção de cursos (para "Seleção de Curso")
    function atualizarSelecaoCursos() {
        const selectCurso = document.getElementById('cursoSelect');
        selectCurso.innerHTML = "<option value=''>Selecione um curso</option>"; // Mantém a opção padrão
        cursos.forEach((curso, index) => {
            selectCurso.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    // Atualizar as opções de cursos na seleção de cursos (para "Venda de Curso")
    function atualizarSelecaoCursosVenda() {
        const selectCursoVenda = document.getElementById('cursoSelectVenda');
        selectCursoVenda.innerHTML = "<option value=''>Selecione um curso</option>"; // Mantém a opção padrão
        cursos.forEach((curso, index) => {
            selectCursoVenda.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    // Atualizar a lista de clientes no HTML
    function atualizarClientes() {
        const listaClientes = document.getElementById('listarCliente');
        listaClientes.innerHTML = "";
        clientes.forEach(cliente => {
            listaClientes.innerHTML += `<li>${cliente.nome} - CPF: ${cliente.cpf}</li>`;
        });
    }

    // Atualizar as opções de clientes na seleção de clientes
    function atualizarSelecaoClientes() {
        const selectCliente = document.getElementById('clienteSelect');
        selectCliente.innerHTML = "<option value=''>Selecione um cliente</option>"; // Mantém a opção padrão
        clientes.forEach((cliente, index) => {
            selectCliente.innerHTML += `<option value="${index}">${cliente.nome}</option>`;
        });
    }

    // Exibir os detalhes do curso e do cliente selecionado para a venda
    function exibirDetalhesVenda(clienteIndex, cursoIndex) {
        const cliente = clientes[clienteIndex];
        const curso = cursos[cursoIndex];

        document.getElementById('clienteVenda').innerText = `Cliente: ${cliente.nome}`;
        document.getElementById('cursoVenda').innerText = `Curso: ${curso.nome}`;
    }

    // Exibir detalhes do curso quando selecionado
    document.getElementById('cursoSelect').addEventListener('change', function() {
        const cursoIndex = this.value;
        const curso = cursos[cursoIndex];

        const detalhesCurso = document.getElementById('detalhesCurso');
        if (curso) {
            detalhesCurso.innerHTML = `
                <h3>Detalhes do Curso Selecionado:</h3>
                <p><strong>Nome:</strong> ${curso.nome}</p>
                <p><strong>Carga Horária:</strong> ${curso.carga} horas</p>
                <p><strong>Valor:</strong> R$ ${curso.valor}</p>
            `;
            detalhesCurso.style.display = 'block';
        } else {
            detalhesCurso.style.display = 'none';
        }
    });

    // Inicializar as seleções de clientes e cursos ao carregar a página
    atualizarSelecaoCursos();
    atualizarSelecaoCursosVenda();
    atualizarSelecaoClientes();
    atualizarVendas();
});

// Função para atualizar a lista de vendas no HTML
function atualizarVendas() {
    const listaVendas = document.getElementById('listarVendas');
    listaVendas.innerHTML = "";
    vendas.forEach(venda => {
        listaVendas.innerHTML += `<li>${venda.cliente} comprou o curso ${venda.curso}</li>`;
    });
}