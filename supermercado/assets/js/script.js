var item = [];

document.querySelector('input[type="submit"]').addEventListener('click', () => {
    let nomeProduto = document.querySelector('input[name="nome_produto"]').value;
    let precoProduto = document.querySelector('input[name="price"]').value;

    item.push({
        nome: nomeProduto,
        valor: precoProduto
    });

    let listaProdutos = document.querySelector('.lista-produtos');
    let soma = 0;
    listaProdutos.innerHTML = "";
    item.map(function (val) {
        soma += Number(val.valor);
        document.querySelector('.soma-produto h1').innerHTML = `Total: R$ ${soma.toFixed(2)}`;
        listaProdutos.innerHTML +=
        `<div class="lista-produtos-single">
            <h3>${val.nome}</h3>
            <span>R$ ${val.valor}</span>
        </div>`;
    });
});

document.querySelector('button[name="limpar"]').addEventListener('click', () => {
    item = [];
    document.querySelector('.lista-produtos').innerHTML = "";
    document.querySelector('.soma-produto h1').innerHTML = `Total: R$ 0,00`;
});

/* 

Explicando o código:

1. Inicialização do Array: O código começa inicializando um array vazio chamado `item`, que será usado para armazenar os produtos adicionados.

2. Adicionando Produtos: Quando o botão de cadastrar é clicado, o código captura os valores dos campos de entrada e os adiciona ao array `item`.

3. Atualização da Lista de Produtos: Após adicionar um produto, o código atualiza a lista de produtos exibida na tela, bem como o total acumulado.

4. Limpeza da Lista: Quando o botão de limpar é clicado, o array `item` é esvaziado, e a lista de produtos e o total são redefinidos para zero.



*/