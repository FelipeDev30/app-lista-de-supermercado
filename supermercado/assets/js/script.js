// Estado da aplicação
class ListaSupermercado {
    constructor() {
        this.produtos = this.carregarDados();
        this.filtroAtivo = 'todos';
        this.produtoEmEdicao = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProdutos();
        this.atualizarEstatisticas();
    }

    setupEventListeners() {
        // Formulário
        document.getElementById('formProduto').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarProduto();
        });

        // Busca
        document.getElementById('buscar_produto').addEventListener('input', (e) => {
            this.filtrarPorBusca(e.target.value);
        });

        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.filter-btn').classList.add('active');
                this.filtroAtivo = e.target.closest('.filter-btn').dataset.filter;
                this.renderProdutos();
            });
        });

        // Botões de ação
        document.getElementById('limpar').addEventListener('click', () => {
            if (confirm('Deseja limpar toda a lista de compras?')) {
                this.limparLista();
            }
        });

        document.getElementById('exportar').addEventListener('click', () => {
            this.exportarLista();
        });
    }

    adicionarProduto() {
        const nomeProduto = document.getElementById('nome_produto').value.trim();
        const precoProduto = parseFloat(document.getElementById('price').value);

        // Validações
        if (!nomeProduto) {
            alert('Por favor, digite o nome do produto');
            return;
        }

        if (!precoProduto || precoProduto < 0) {
            alert('Por favor, digite um preço válido');
            return;
        }

        // Adicionar produto
        const novoProduto = {
            id: Date.now(),
            nome: nomeProduto,
            valor: precoProduto,
            comprado: false,
            dataCriacao: new Date().toLocaleDateString('pt-BR')
        };

        this.produtos.push(novoProduto);
        this.salvarDados();
        this.renderProdutos();
        this.atualizarEstatisticas();

        // Limpar campos
        document.getElementById('formProduto').reset();
        document.getElementById('nome_produto').focus();
    }

    deletarProduto(id) {
        if (confirm('Deseja deletar este produto?')) {
            this.produtos = this.produtos.filter(p => p.id !== id);
            this.salvarDados();
            this.renderProdutos();
            this.atualizarEstatisticas();
        }
    }

    toggleComprado(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (produto) {
            produto.comprado = !produto.comprado;
            this.salvarDados();
            this.renderProdutos();
            this.atualizarEstatisticas();
        }
    }

    filtrarPorBusca(termo) {
        const listaProdutos = document.getElementById('lista-produtos');
        const produtosFiltrados = this.produtos.filter(p =>
            p.nome.toLowerCase().includes(termo.toLowerCase())
        );

        if (produtosFiltrados.length === 0) {
            listaProdutos.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>Nenhum produto encontrado</p>
                </div>
            `;
            return;
        }

        this.renderProdutosLista(produtosFiltrados);
    }

    renderProdutos() {
        let produtosFiltrados = this.produtos;

        // Aplicar filtro de status
        if (this.filtroAtivo === 'comprados') {
            produtosFiltrados = this.produtos.filter(p => p.comprado);
        } else if (this.filtroAtivo === 'pendentes') {
            produtosFiltrados = this.produtos.filter(p => !p.comprado);
        }

        this.renderProdutosLista(produtosFiltrados);
    }

    renderProdutosLista(produtosFiltrados) {
        const listaProdutos = document.getElementById('lista-produtos');

        if (produtosFiltrados.length === 0) {
            listaProdutos.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Nenhum produto na lista</p>
                </div>
            `;
            return;
        }

        listaProdutos.innerHTML = produtosFiltrados.map(produto => `
            <div class="lista-produtos-single ${produto.comprado ? 'completed' : ''}">
                <div class="product-info">
                    <input 
                        type="checkbox" 
                        class="product-checkbox" 
                        ${produto.comprado ? 'checked' : ''}
                        onchange="app.toggleComprado(${produto.id})"
                    >
                    <div class="product-details">
                        <p class="product-name">${this.escaparHtml(produto.nome)}</p>
                        <p class="product-price">${produto.dataCriacao}</p>
                    </div>
                </div>
                <div class="price-display">R$ ${produto.valor.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="btn-icon delete" onclick="app.deletarProduto(${produto.id})" title="Deletar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    atualizarEstatisticas() {
        const total = this.produtos.length;
        const comprados = this.produtos.filter(p => p.comprado).length;
        const pendentes = total - comprados;
        const totalValor = this.produtos.reduce((sum, p) => sum + p.valor, 0);

        document.getElementById('total-itens').textContent = total;
        document.getElementById('total-comprados').textContent = comprados;
        document.getElementById('total-pendentes').textContent = pendentes;
        document.getElementById('total-valor').textContent = `R$ ${totalValor.toFixed(2)}`;
    }

    limparLista() {
        this.produtos = [];
        this.salvarDados();
        this.renderProdutos();
        this.atualizarEstatisticas();
    }

    exportarLista() {
        if (this.produtos.length === 0) {
            alert('Nenhum produto para exportar');
            return;
        }

        let conteudo = 'LISTA DE SUPERMERCADO\n';
        conteudo += '=====================\n\n';
        conteudo += 'Pendentes:\n';

        const pendentes = this.produtos.filter(p => !p.comprado);
        if (pendentes.length === 0) {
            conteudo += 'Nenhum item pendente\n';
        } else {
            pendentes.forEach(p => {
                conteudo += `☐ ${p.nome} - R$ ${p.valor.toFixed(2)}\n`;
            });
        }

        conteudo += '\nComprados:\n';
        const comprados = this.produtos.filter(p => p.comprado);
        if (comprados.length === 0) {
            conteudo += 'Nenhum item comprado\n';
        } else {
            comprados.forEach(p => {
                conteudo += `☑ ${p.nome} - R$ ${p.valor.toFixed(2)}\n`;
            });
        }

        const totalValor = this.produtos.reduce((sum, p) => sum + p.valor, 0);
        conteudo += `\n\nTOTAL: R$ ${totalValor.toFixed(2)}`;

        // Download
        const blob = new Blob([conteudo], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lista-supermercado-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    salvarDados() {
        localStorage.setItem('listaProdutos', JSON.stringify(this.produtos));
    }

    carregarDados() {
        const dados = localStorage.getItem('listaProdutos');
        return dados ? JSON.parse(dados) : [];
    }

    escaparHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
}

// Inicializar aplicação
const app = new ListaSupermercado();