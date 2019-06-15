const IP = window.location.hostname + ':5000';
// const IP = "169.254.10.1" + ':5000';
const socket = io.connect(IP);
let selected = '';
let selectedIndex = '';
let weatherreport = '';

const getSelectedindex = function(data) {
  for (i in data) {
    if (data[i].id == selected) {
      selectedIndex = i;
    }
  }
  console.log(selectedIndex);
};

const ListentoPrevious = function() {
  document.querySelector('.js-previous').addEventListener('click', function() {
    selectedIndex--;
    show_Weather(weatherreport, selectedIndex, false);
  });
};
const ListentoNext = function() {
  document.querySelector('.js-next').addEventListener('click', function() {
    selectedIndex++;
    show_Weather(weatherreport, selectedIndex, false);
  });
};

const showPrev = function() {
  document.querySelector('.before').innerHTML =
    '<svg class="js-previous" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/><path fill="none" d="M0 0h24v24H0z"/></svg>';

  ListentoPrevious();
};

const showNext = function() {
  document.querySelector('.after').innerHTML =
    '<svg class="js-next" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" /><path fill="none" d="M0 0h24v24H0z" /></svg>';

  ListentoNext();
};

const delNext = function() {
  document.querySelector('.after').innerHTML = '';
};
const delPrev = function() {
  document.querySelector('.before').innerHTML = '';
};

const showNavigation = function(blub) {
  if (blub == weatherreport.cnt - 1) {
    showPrev();
    delNext();
  } else if (blub == 0) {
    showNext();
    delPrev();
  } else {
    showPrev();
    showNext();
  }
};

const showDots = function(show) {
  let result = '';
  for (i in weatherreport.list) {
    if (i == show) {
      result += '<span class="dot js-show"></span>';
    } else {
      result += '<span class="dot"></span>';
    }
  }
  document.querySelector('.js-dots').innerHTML = result;
};
const geefDag = function(datum) {
  const dag = new Date(datum * 1000);
  const dagnummer = dag.getDay();

  switch (dagnummer) {
    case 0:
      return 'maandag';
    case 1:
      return 'dinsdag';
    case 2:
      return 'woensdag';
    case 3:
      return 'donderdag';
    case 4:
      return 'vrijdag';
    case 5:
      return 'zaterdag';
    case 6:
      return 'zondag';
  }
};
const weatherCodeToSVG = function(weercode) {
  let codeString = weercode.toString();
  let eersteDigit = codeString.substring(0, 1);
  if (weercode === 800) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>';
  } else if (weercode === 801) {
    return `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z" /></svg>`;
  } else {
    switch (eersteDigit) {
      case '2':
        return '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z" /></svg>';
        break;
      case '3':
        return '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M14.83,15.67C16.39,17.23 16.39,19.5 14.83,21.08C14.05,21.86 13,22 12,22C11,22 9.95,21.86 9.17,21.08C7.61,19.5 7.61,17.23 9.17,15.67L12,11L14.83,15.67M13.41,16.69L12,14.25L10.59,16.69C9.8,17.5 9.8,18.7 10.59,19.5C11,19.93 11.5,20 12,20C12.5,20 13,19.93 13.41,19.5C14.2,18.7 14.2,17.5 13.41,16.69Z" /></svg>';
        break;
      case '5':
        return `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z" /></svg>`;

        break;
      case '6':
        return `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z" /></svg>`;
        break;
      case '7':
        return `<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z" /></svg>`;
        break;
      case '8':
        return `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
    <path d="M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z" />
</svg>`;
        break;
      // default:
      //     return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" /></svg>';
    }
  }
};
// document.querySelector('body');
const weathercodeToImage = function(weercode) {
  let codeString = weercode.toString();
  let eersteDigit = codeString.substring(0, 1);
  if (weercode == 800) {
    document.querySelector('html').className = '';
    document.querySelector('html').classList.add('zon');
  } else if (weercode == 801 || weercode == 802) {
    document.querySelector('html').className = '';
    document.querySelector('html').classList.add('licht_bewolkt');
  } else {
    switch (eersteDigit) {
      case '2':
        document.querySelector('html').className = '';
        if (Math.random() > 0.5) {
          document.querySelector('html').classList.add('onweer1');
        } else {
          document.querySelector('html').classList.add('onweer2');
        }
        break;
      case '3':
        document.querySelector('html').className = '';
        document.querySelector('html').classList.add('regen');
        break;
      case '5':
        document.querySelector('html').className = '';
        document.querySelector('html').classList.add('regen');
        break;
      case '6':
        document.querySelector('html').className = '';
        document.querySelector('html').classList.add('sneeuw');
        break;
      case '7':
        document.querySelector('html').className = '';
        document.querySelector('html').classList.add('mist');
        break;
      case '8':
        document.querySelector('html').className = '';
        document.querySelector('html').classList.add('zwaar_bewolkt');
        break;
      // default:
      //     return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" /></svg>';
    }
  }
};

const showForecast = function(data) {
  let dag = 0;
  let result = '';
  for (let weerbericht of data.list) {
    //tekst += `<div class="forecast">`;
    if (weerbericht.dt_txt.substr(11) === '12:00:00') {
      result += `<li class="c-weekdag o-layout">
      <span class="o-layout__item u-width-forecast">${geefDag(weerbericht.dt)}</span>
      <span class="o-layout__item u-width-auto">
      ${weatherCodeToSVG(weerbericht.weather['0'].id)}
      </span>
      <div class="u-width-forecast o-layout u-right ">
          <span class="o-layout__item u-1-of-2">${Math.round(weerbericht.main.temp_max)}</span>
          <span class="o-layout__item u-1-of-2">${Math.round(weerbericht.main.temp_min)}</span>
      </div>
      
    </li>`;
      dag++;
      if (dag == 5) {
        break;
      }
    }
  }
  document.querySelector(`.js-forecast`).innerHTML = result;
};

const show_Weather = function(data, show = selected, first = true) {
  weatherreport = data;
  if (first) {
    getSelectedindex(data.list);
    show = selectedIndex;
  }
  showNavigation(show);
  showDots(show);
  console.log(data.list[show]);
  document.querySelector('.js-city').innerHTML = data.list[show].name;
  document.querySelector('.js-temp').innerHTML = Math.round(data.list[show].main.temp);
  document.querySelector('.js-desc').innerHTML = data.list[show].weather[0].description;
  document.querySelector('.js-vocht').innerHTML = data.list[show].main.humidity;
  document.querySelector('.js-wind').innerHTML = data.list[show].wind.speed;
  document.querySelector('.js-cloud').innerHTML = data.list[show].clouds.all;
  document.querySelector('.js-druk').innerHTML = data.list[show].main.pressure;
  weathercodeToImage(data.list[show].weather[0].id);
  handleData(
    `http://api.openweathermap.org/data/2.5/forecast?id=${
      data.list[show].id
    }&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`,
    showForecast
  );
};

const get_weather = function(data) {
  console.log(
    `http://api.openweathermap.org/data/2.5/group?id=${data}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`
  );
  handleData(
    `http://api.openweathermap.org/data/2.5/group?id=${data}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`,
    show_Weather
  );
};

socket.on('weerbericht', function(data) {
  // console.log(data);
  selected = data[0];
  let result = '';
  for (i in data[1]) {
    if (i == data[1].length - 1) {
      result += data[1][i];
    } else {
      result += data[1][i] + ',';
    }
  }
  get_weather(result);
});
