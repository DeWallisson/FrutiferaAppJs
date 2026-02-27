// defini uma função que recebe uma string de data
const calcularIdadeMeses = (dataPlantio) => {
    // dividi a string onde tem / para criar um array
    let partes = dataPlantio.split('/');
    // transformando as strings do array em números inteiros
    let dia = parseInt(partes[0]);
    let mes = parseInt(partes[1]);
    let ano = parseInt(partes[2]);
    // crio uma nova variavel para atribuir uma data
    let dataInicio = new Date(ano, mes - 1, dia);
    let dataHoje = new Date();
    // tratamento de codigo para ver se é inválida
    if (isNaN(dataInicio.getTime())) {
        return 0;
    }

    // calculo da diferença dos anos e meses
    let difeAnos = dataHoje.getFullYear() - dataInicio.getFullYear();
    let difeMeses = dataHoje.getMonth() - dataInicio.getMonth();
    // e por fim transforma os anos em meses utilizando a data de inicio do plantio e a data atual
    return (difeAnos * 12) + difeMeses;
};

// definindo a função que vai desenhar os cards
let renderizarCardFrutifera = () => {
    // pegando o html onde os cards serao inseridos
    const container = document.getElementById('FrutiferasCardsContainer');
    // uma variável vazia para acumular o html de todos os cards inseridos
    let AcumulandoCards = "";
    // funçao para percorrer todos objetos dentro da lista de frutiferas
    listaFrutiferas.forEach(frutifera => {
        // chamando a função para fazer o calculo da idade em meses
        const idadeEmMeses = calcularIdadeMeses(frutifera.DataPlantio);
        AcumulandoCards += `
            <div class="col-md-4 mb-4" id="card-${frutifera.id}">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-success">${frutifera.NomeEspecie}</h5>
                        <h6 class="card-subtitle mb-2 text-muted"><i>${frutifera.NomeCientifico}</i></h6>
                        <p class="card-text">
                            <strong>Produção:</strong> ${frutifera.producao} Kg/safra<br>
                            <strong>Idade:</strong> ${idadeEmMeses} meses
                        </p>
                        <button class="btn btn-outline-danger btn-sm" onclick="removerFrutifera(${frutifera.id})">Excluir</button>
                    </div>
                    <div class="card-footer bg-transparent border-0 p-0 text-center">
                        <small class="text-muted">ID: ${frutifera.id}</small>
                    </div>
                </div>
            </div>`;
    });

    // Atualizamos o DOM uma vez ja que os cards estao todos juntos
    container.innerHTML = AcumulandoCards;
};

// tornei a variável global com o window para que o html consiga achar
window.removerFrutifera = (id) => {
    // atualiza a lista na memoria
    // o filter vai criar uma nova lista contendo todas as frutas deixando de fora apenas a que tem o id que queremos excluir
    listaFrutiferas = listaFrutiferas.filter(fruta => fruta.id !== id);

    // salvando a lista com a fruta removida
    localStorage.setItem('frutiferas', JSON.stringify(listaFrutiferas));

    // chama a função de renderizar para atualizar a tela
    renderizarCardFrutifera();
    // mostra uma mensagem na tela quando remover o card
    Toastify({
        text: "Removido com sucesso!",
        style: {
            background: "red"
        }
    }).showToast();
};


// busca os dados no localStorage, se houver ele converte para um array de objetos, se não houver tem o tratamento para null
let listaFrutiferas = JSON.parse(localStorage.getItem('frutiferas')) ?? [];
// desenhar os cards na tela
renderizarCardFrutifera();

// controlando o browseer completamente
// pega o formulario pelo id do html
let FrutiferaForm = document.getElementById('FrutiferaForm');
FrutiferaForm.onsubmit = (event) => {
  event.preventDefault();

  // capta os valores digitados nos elementos do formulário
  let NomeEspecieInput = document.getElementById('NomeEspecie');
  let NomeEspecie = NomeEspecieInput.value;

  let NomeCientificoInput = document.getElementById('NomeCientifico');
  let NomeCientifico = NomeCientificoInput.value;

  let producaoInput = document.getElementById('producao');
  let producao = producaoInput.value;

  let DataPlantioInput = document.getElementById('DataPlantio');
  let DataPlantio = DataPlantioInput.value;

  // colocando as informações em um objeto Json
  let frutiferaJson = {
    // cria um id único para cada planta
    id: Date.now(),
    NomeEspecie: NomeEspecie,
    NomeCientifico: NomeCientifico,
    producao: producao,
    DataPlantio: DataPlantio,
  };
  listaFrutiferas.push(frutiferaJson);
  // agora salva a lista atualizada no localStorage e também converte a lista para string
  localStorage.setItem(
    'frutiferas',
    JSON.stringify(listaFrutiferas),
  );
  // Atualiza os cards na tela logo após salvar
  renderizarCardFrutifera();
  // fecha o modal
  $('#FrutiferaModal').modal('hide');
  // reseta os campos de adicionar a frutifera
  FrutiferaForm.reset();

  // mostra uma mensagem na tela quando adicionar uma nova fruta
  Toastify({
    text: 'Frutífera salva com sucesso!',
    className: 'info',
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  }).showToast();
};