const IP = window.location.hostname + ':5000';
// const IP = "169.254.10.1" + ':5000';
const socket = io.connect(IP);

const setColor = function(temp) {
  if (temp > 20) {
    document.querySelector('body').classList.remove('cold');
    document.querySelector('body').classList.add('hot');
  } else {
    document.querySelector('body').classList.remove('hot');
    document.querySelector('body').classList.add('cold');
  }
};
socket.on('new_data', function(data) {
  console.log(data);
  setColor(data.Temp);
});

const ListenToLocatie=function(){
  for( i of document.querySelectorAll('.link-2')){
    i.addEventListener('click',function(){
      socket.emit('nieuw_geselecteerd',this.id)
    })
  }
}
const show_Locations = function(data) {
  console.log(data)
  let result = '';
  let eerste=true
  for (i of data.list) {
    let padding = 'u-pt-clear';
    if (eerste) {
      padding = 'u-pt-16';
    }
    result += `<div class="o-row o-row--md ${padding}">
    <div class="o-container">
    <a href="./weerbericht.html"><span id='${i.id}' class="link-2"></span></a>
      <div class="o-layout o-layout--align-center c-sensor ">
        <div class="u-1-of-2 o-layout__item">
          <div class="c-title u-left ">${i.name}</div>
          <p class="c-title c-title--sm u-left">${i.sys.country}</p>
        </div>
        <p class="c-temp--sm u-right u-1-of-2 o-layout__item">${i.main.temp.toString().substring(0,4)}°C</p>
      </div>

      <hr class="u-mt-neg" />
    </div>
  </div>`;
  eerste=false
  }
  document.querySelector('.js-locaties').innerHTML = result;
  ListenToLocatie()
};

const get_weather = function(data) {
  handleData(
    `http://api.openweathermap.org/data/2.5/group?id=${data}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`,
    show_Locations
  );
  // handleData(`http://api.openweathermap.org/data/2.5/group?id=2794056&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`,show_Locations);
};

socket.on('locaties', function(data) {
  console.log(data);
  let result = '';
  for (i in data) {
    if (i == data.length - 1) {
      result += data[i];
    } else {
      result += data[i] + ',';
    }
  }
  get_weather(result);
});

const init = function() {
  console.log(window.location.hostname)
};
document.addEventListener('DOMContentLoaded', function() {
  console.info('DOM geladen');
  init();
});
