const calcularIdadeMeses = (dataPlantio) => {
    let partes = dataPlantio.split('/');
    // transforma as partes em números inteiros
    let dia = parseInt(partes[0]);
    let mes = parseInt(partes[1]);
    let ano = parseInt(partes[2]);

    let dataInicio = new Date(ano, mes - 1, dia);
    let dataHoje = new Date();

    if (isNaN(dataInicio.getTime())) {
        return 0;
    }


    let difeAnos = dataHoje.getFullYear() - dataInicio.getFullYear();
    let difeMeses = dataHoje.getMonth() - dataInicio.getMonth();

    return (difeAnos * 12) + difeMeses;
};


let renderizarCardFrutifera = () => {
    const container = document.getElementById('FrutiferasCardsContainer');
    
    let AcumulandoCards = "";

    listaFrutiferas.forEach(frutifera => {

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


window.removerFrutifera = (id) => {
    // atualiza a lista na memoria
    listaFrutiferas = listaFrutiferas.filter(fruta => fruta.id !== id);

    // salvando a lista com a fruta removida
    localStorage.setItem('frutiferas', JSON.stringify(listaFrutiferas));

    // chama a função para redesenhar os cards
    renderizarCardFrutifera();

    Toastify({
        text: "Removido com sucesso!",
        style: {
            background: "red"
        }
    }).showToast();
};



let listaFrutiferas = JSON.parse(localStorage.getItem('frutiferas')) ?? [];
renderizarCardFrutifera();

// Controlando o browseer completamente
let FrutiferaForm = document.getElementById('FrutiferaForm');
FrutiferaForm.onsubmit = (event) => {
  event.preventDefault();

  // Capta os valores digitados nos elementos do formulário.
  let NomeEspecieInput = document.getElementById('NomeEspecie');
  let NomeEspecie = NomeEspecieInput.value;

  let NomeCientificoInput = document.getElementById('NomeCientifico');
  let NomeCientifico = NomeCientificoInput.value;

  let producaoInput = document.getElementById('producao');
  let producao = producaoInput.value;

  let DataPlantioInput = document.getElementById('DataPlantio');
  let DataPlantio = DataPlantioInput.value;

  // Persistir os dados no LocalStorage.
  let frutiferaJson = {
    id: Date.now(),
    NomeEspecie: NomeEspecie,
    NomeCientifico: NomeCientifico,
    producao: producao,
    DataPlantio: DataPlantio,
  };
  listaFrutiferas.push(frutiferaJson);

  localStorage.setItem(
    'frutiferas',
    JSON.stringify(listaFrutiferas),
  );

  // Atualiza os cards.
  renderizarCardFrutifera();

  $('#FrutiferaModal').modal('hide');

  FrutiferaForm.reset();


  Toastify({
    text: 'Frutífera salva com sucesso!',
    className: 'info',
    style: {
      background: 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  }).showToast();
};