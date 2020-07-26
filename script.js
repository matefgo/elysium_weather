window.addEventListener('load', start);

// função principal
async function start() {
  let solInfo = await getAPIData();
  renderCurrentSol(solInfo[0]);
  renderPreviousSol(solInfo.slice(1, 6));
  infoButtons();
}

// acessa a API e retorna o JSON recebido manipulado
async function getAPIData() {
  const res = await fetch(
    'https://api.nasa.gov/insight_weather/?api_key=z5REoKtfaBJmjXS6QyM0f3VPzPSGjHzJeW3lMCZz&feedtype=json&ver=1.0'
  );
  const json = await res.json();
  return marsDays(json);
}

// manipula o JSON recebido, retornando apenas os dados solicitados
function marsDays(data) {
  const numberOfDays = data.sol_keys.length;
  const daysArray = [];

  // preenche o array de maneira decrescente, assim o dia mais recente fica na posição 0
  for (let i = numberOfDays - 1; i >= 0; i--) {
    let solNumber = data.sol_keys[i];
    let { AT, PRE, HWS, Season } = data[solNumber];

    // atribuição dos valores feita externamente para melhor leitura.
    // além de verificar a existência do dado, arredonda os valores numéricos.
    let averageTemperature = !!AT.av ? +toFarenheit(AT.av).toFixed(1) : '---';
    let averageWindSpeed = !!HWS.av ? +HWS.av.toFixed(1) : '---';
    let season = !!Season ? Season : '---';
    let atmosphericPressure = !!PRE.av ? PRE.av.toFixed(2) : '---';

    daysArray.push({
      solNumber,
      averageTemperature,
      averageWindSpeed,
      season,
      atmosphericPressure,
    });
  }
  return daysArray;
}

// renderiza os valores do Sol (mais) atual
function renderCurrentSol(solInfo) {
  const icon = seasonIcon(solInfo.season);

  const currentSeason = document.getElementById('currentSeason');
  currentSeason.innerHTML = `<p>${solInfo.season}</p>${icon}`;

  const currentNumber = document.getElementById('currentNumber');
  currentNumber.innerHTML = `<p>Sol ${solInfo.solNumber}</p>`;

  const currentTemperature = document.getElementById('currentTemperature');
  currentTemperature.innerHTML = `<p><span class="numberType">${solInfo.averageTemperature}</span> °F</p>`;

  const currentWind = document.getElementById('currentWind');
  currentWind.innerHTML = `<p>wind speed: <span class="numberType">${solInfo.averageWindSpeed}</span> km/h</p>`;

  const currentPressure = document.getElementById('currentPressure');
  currentPressure.innerHTML = `<p>pressure: <span class="numberType">${solInfo.atmosphericPressure}</span> Pa</p>`;
}

// renderiza os valores de cada Sol anterior disponível
function renderPreviousSol(solInfo) {
  const previousSol = document.getElementById('previousSol');

  if (solInfo.length > 0) {
    previousSol.innerHTML = '';
  }

  solInfo.forEach((sol) => {
    let icon = seasonIcon(sol.season);
    return (previousSol.innerHTML += `<div class="previous">
      <div class="season"><p>${sol.season}</p>${icon}</div>
      <p class="number">Sol ${sol.solNumber}</p>
      <p class="temperature"><span class="numberType">${sol.averageTemperature}</span> °F</p>
      <p class="wind">wind speed: <span class="numberType">${sol.averageWindSpeed}</span> km/h</p>
      <p class="pressure">pressure: <span class="numberType">${sol.atmosphericPressure}</span> Pa</p>
    </div>`);
  });
}

// converte os valores de AT.av dados de graus Celsius para graus Farenheit
function toFarenheit(temperature) {
  return temperature * (9 / 5) + 32;
}

// retorna o ícone de acordo com a estação informada
function seasonIcon(season) {
  if (season === 'spring') {
    return '<i class="material-icons">filter_vintage</i>';
  } else if (season === 'summer') {
    return '<i class="material-icons">wb_sunny</i>';
  } else if (season === 'fall') {
    return '<i class="material-icons">add</i>';
  } else if (season === 'winter') {
    return '<i class="material-icons">ac_unit</i>';
  } else {
    return '';
  }
}

// aciona os botões laterais
function infoButtons() {
  const curiousButton = document.getElementById('curiousButton');
  const curiousInfo = document.getElementById('curiousInfo');

  const lostButton = document.getElementById('lostButton');
  const lostInfo = document.getElementById('lostInfo');

  curiousButton.addEventListener('click', () => {
    const curiousOpacityStatus = curiousInfo.style.opacity;
    if (!curiousOpacityStatus || curiousOpacityStatus === '0') {
      curiousInfo.style.opacity = '1';
    } else if (curiousOpacityStatus === '1') {
      curiousInfo.style.opacity = '0';
    }
  });

  lostButton.addEventListener('click', () => {
    const lostOpacityStatus = lostInfo.style.opacity;
    if (!lostOpacityStatus || lostOpacityStatus === '0') {
      lostInfo.style.opacity = '1';
    } else if (lostOpacityStatus === '1') {
      lostInfo.style.opacity = '0';
    }
  });

  // fecha as divs de info quando há click fora do botão
  document.addEventListener('click', () => {
    if (
      document.activeElement !== curiousButton &&
      curiousInfo.style.opacity === '1'
    ) {
      curiousInfo.style.opacity = '0';
    } else if (
      document.activeElement !== lostButton &&
      lostInfo.style.opacity === '1'
    ) {
      lostInfo.style.opacity = '0';
    }
  });

  // fecha as divs de info detectando o botão ESC
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      lostInfo.style.opacity = '0';
      curiousInfo.style.opacity = '0';
    }
  });
}

// script to Materialize que trabalha com as classes collapsible
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});
