let cursos = JSON.parse(localStorage.getItem('cursos')) || [];
let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
let vendas = JSON.parse(localStorage.getItem('vendas')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Cadastro de Curso
    document.getElementById('cursoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('cursoNome').value.trim();
        const carga = parseInt(document.getElementById('cursoCarga').value.trim(), 10);
        const valor = parseFloat(document.getElementById('cursoValor').value.trim());

        if (cursos.some(curso => curso.nome.toLowerCase() === nome.toLowerCase())) {
            alert("Este curso já foi cadastrado.");
            return;
        }

        cursos.push({ nome, carga, valor });
        salvarDados();
        atualizarSelecaoCursosDetalhe();
        atualizarCursosParaClientes();
        document.getElementById('cursoForm').reset();
    });

    // Cadastro de Cliente
    document.getElementById('clienteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('clienteNome').value.trim();
        const cpf = document.getElementById('clienteCPF').value.trim().replace(/\D/g, '');
        const cursoIndex = document.getElementById('cursoCliente').value;

        if (!validarCPF(cpf)) {
            alert("CPF inválido.");
            return;
        }

        if (clientes.some(c => c.cpf === cpf)) {
            alert("Este CPF já está cadastrado.");
            return;
        }

        if (cursoIndex === "") {
            alert("Selecione um curso.");
            return;
        }

        const cursoNome = cursos[cursoIndex].nome;

        // Salvar o curso no cliente
        const cliente = { nome, cpf, curso: cursoNome };
        clientes.push(cliente);

        salvarDados();
        atualizarSelecaoClientes();
        document.getElementById('clienteForm').reset();
    });

    // Atualiza o curso automaticamente ao selecionar cliente na venda
    document.getElementById('clienteSelect').addEventListener('change', function () {
        const clienteIndex = this.value;
        const inputCurso = document.getElementById('cursoInputVenda');

        if (clienteIndex === "") {
            inputCurso.value = "";
            return;
        }

        const cliente = clientes[clienteIndex];
        inputCurso.value = cliente.curso || "";
    });

    // Registrar Venda
    document.getElementById('vendaForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const clienteIndex = document.getElementById('clienteSelect').value;
        const cursoNome = document.getElementById('cursoInputVenda').value;

        if (clienteIndex === "" || !cursoNome) {
            alert("Cliente ou curso não selecionado.");
            return;
        }

        const cliente = clientes[clienteIndex];
        vendas.push({ cliente: cliente.nome, cpf: cliente.cpf, curso: cursoNome });
        salvarDados();

        alert("Venda registrada com sucesso!");
        limparDetalhesVenda();
    });

    // Exibir detalhes do curso
    document.getElementById('cursoSelectDetalhe').addEventListener('change', function () {
        const cursoIndex = this.value;
        const curso = cursos[cursoIndex];
        const detalhesCurso = document.getElementById('detalhesCurso');

        if (curso) {
            detalhesCurso.innerHTML = `
                <h3>Detalhes do Curso Selecionado:</h3>
                <p><strong>Nome:</strong> ${curso.nome}</p>
                <p><strong>Carga Horária:</strong> ${curso.carga} horas</p>
                <p><strong>Valor:</strong> R$ ${curso.valor.toFixed(2)}</p>
            `;
            detalhesCurso.style.display = 'block';
        } else {
            detalhesCurso.style.display = 'none';
        }
    });

    // Buscar vendas por CPF
    document.getElementById('buscaCPFForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const cpfBusca = document.getElementById('cpfBusca').value.trim().replace(/\D/g, '');
        const resultadoBusca = document.getElementById('resultadoBusca');
        resultadoBusca.innerHTML = '';
        resultadoBusca.style.display = 'none';

        if (!validarCPF(cpfBusca)) {
            alert("Digite um CPF válido.");
            return;
        }

        const vendasFiltradas = vendas.filter(v => v.cpf === cpfBusca);

        if (vendasFiltradas.length === 0) {
            resultadoBusca.innerHTML = `<p>Nenhuma venda encontrada para o CPF informado.</p>`;
            resultadoBusca.style.display = 'block';
            return;
        }

        let html = '<h3>Vendas Encontradas:</h3>';
        vendasFiltradas.forEach(venda => {
            html += `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background: #fff;">
                    <p><strong>Cliente:</strong> ${venda.cliente}</p>
                    <p><strong>CPF:</strong> ${venda.cpf}</p>
                    <p><strong>Curso:</strong> ${venda.curso}</p>
                </div>
            `;
        });

        resultadoBusca.innerHTML = html;
        resultadoBusca.style.display = 'block';
    });

    // Funções auxiliares
    function atualizarSelecaoCursosDetalhe() {
        const selectCurso = document.getElementById('cursoSelectDetalhe');
        selectCurso.innerHTML = "<option value=''>Selecione um curso</option>";
        cursos.forEach((curso, index) => {
            selectCurso.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    function atualizarCursosParaClientes() {
        const selectCursoCliente = document.getElementById('cursoCliente');
        selectCursoCliente.innerHTML = "<option value=''>Selecione um curso</option>";
        cursos.forEach((curso, index) => {
            selectCursoCliente.innerHTML += `<option value="${index}">${curso.nome}</option>`;
        });
    }

    function atualizarSelecaoClientes() {
        const selectCliente = document.getElementById('clienteSelect');
        selectCliente.innerHTML = "<option value=''>Selecione um cliente</option>";
        clientes.forEach((cliente, index) => {
            selectCliente.innerHTML += `<option value="${index}">${cliente.nome}</option>`;
        });
    }

    function limparDetalhesVenda() {
        document.getElementById('clienteSelect').value = "";
        document.getElementById('cursoInputVenda').value = "";
    }

    function salvarDados() {
        localStorage.setItem('cursos', JSON.stringify(cursos));
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('vendas', JSON.stringify(vendas));
    }

    // Validação de CPF padrão brasileiro
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = 11 - (soma % 11);
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.charAt(10));
    }

    // Inicializar selects com dados armazenados
    atualizarSelecaoCursosDetalhe();
    atualizarCursosParaClientes();
    atualizarSelecaoClientes();
});
