// #region Algemeen
//const IP = prompt('geef publiek IP', 'http://127.0.0.1:5000');
const tehoog = [
  'Koop een luchtontvochtiger',
  'Temperatuur omlaag brengen',
  'Raam open zetten',
  'Kook zo weinig mogelijk water',
  // 'Droog je gewassen kleren buiten aan een droogrek of in een droogmachine',
  'Douche met kouder water'
];
const telaag = [
  'Koop een lucht bevochtiger',
  'Droog je gewassen kleren in de kamer aan een droogrek',
  'Voeg kamerplanten aan de kamen',
  'Gebruik een spray fles gevuld met water'
];
const IP = window.location.hostname + ':5000';
// const IP = '169.254.10.1' + ':5000';
const socket = io.connect(IP);
let domtemp = '';
let domvocht = '';
let domco2 = '';
let domtips = '';
let domvochtstatus = '';
let domco2status = '';
// socket.on('nieuwe_klap', function(data) {
//   domklap.innerHTML = data;
// });
const setColor = function(temp) {
  if (temp > 20) {
    document.querySelector('body').classList.remove('cold');
    document.querySelector('body').classList.add('hot');
  } else {
    document.querySelector('body').classList.remove('hot');
    document.querySelector('body').classList.add('cold');
  }
};
const showtips = function(vocht) {
  let result = '';
  if (vocht < 40) {
    domvochtstatus.innerHTML = 'te laag';
    for (i of telaag) {
      result += `<li class="c-title c-title--sm u-left c-title--tips">${i}</li>`;
    }
  } else if (vocht > 60) {
    domvochtstatus.innerHTML = 'te hoog';
    for (i of tehoog) {
      result += `<li class="c-title c-title--sm u-left c-title--tips">${i}</li>`;
    }
  }
  domtips.innerHTML = result;
};
const showCO2Status = function(data) {
  if (data > 1000) {
    domco2status.innerHTML = 'hoog';
  } else if (data > 2000) {
    domco2status.innerHTML = 'zeer hoog';
  } else if (data > 5000) {
    domco2status.innerHTML = 'veel te hoog';
  } else if (data > 8000) {
    domco2status.innerHTML = 'extreem hoog';
  }
};

socket.on('new_data', function(data) {
  console.log(data);
  showtips(data.Humidity);
  setColor(data.Temp);

  domvocht.innerHTML = data.Humidity;
  domtemp.innerHTML = data.Temp;
  domco2.innerHTML = data.CO2;
  showCO2Status(data.CO2);
});

const drawChart = function(data, options) {
  new Chartist.Line('.ct-chart', data, options);
};

const processData = function(data) {
  console.log(data);
  let converted_data = [];
  let converted_labels = [];

  for (const iphone of data) {
    converted_labels.push(iphone.unit);
    converted_data.push(iphone.price);
  }

  console.log(converted_data);

  const new_data = { labels: converted_labels, series: [converted_data] };
  const options = {
    width: '100%',
    height: '400px',
    low: 350,
    high: 1150,
    lineSmooth: Chartist.Interpolation.cardinal({ tension: 0.2 })
  };

  drawChart(new_data, options);
};
const showHistoriek = function(data) {
  let tekst = '';
  for (i = 0; i < data.length; i += 3) {
    tekst += `<div class="o-layout o-layout--align-center c-title">
    <div class="o-layout__item u-1-of-4">
        <p class="c-sensor_data fz16"><span class="js-vocht ">${data[i].uur}u</p>
    </div>
    <div class="o-layout__item u-1-of-4">
      <p class="c-sensor_data fz16"><span class="js-vocht ">${Math.round(data[i + 1].waarde,2)}</span>%</p>
    </div>
    <div class="o-layout__item u-1-of-4">
      <p class="js-vocht-status fz16">${Math.round(data[i].waarde,2)}ppm</p>
    </div>
    <div class="o-layout__item u-1-of-4">
      <p class="js-vocht-status fz16">${Math.round(data[i + 2].waarde,2)}°C</p>
    </div>
  </div>`;
  }
  document.querySelector('#historiek').innerHTML += tekst;
};

const init = function() {
  domtemp = document.querySelector('.js-temp');
  domvocht = document.querySelector('.js-vocht');
  domco2 = document.querySelector('.js-co2');
  domtips = document.querySelector('.js-tips');
  domvochtstatus = document.querySelector('.js-vocht-status');
  domco2status = document.querySelector('.js-co2-status');
  handleData(`http://${IP}/api/v1/historiek`, showHistoriek);
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('DOM geladen');
  init();
});
// var intervalID = window.setInterval(myCallback, 10000);

// function myCallback() {
//   socket.emit("get_dht")
//   console.log("hallo")

//  // Your code here
// }
// #endregion
