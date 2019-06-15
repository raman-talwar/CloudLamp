const IP = window.location.hostname + ':5000';
// const IP = "169.254.10.1" + ':5000';
const socket = io.connect(IP);
let arrTeVerwijderen = [];
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
const listenToDelete=function(){
    document.querySelector(".js-delete").addEventListener('click',function(){
        socket.emit("locatie_verwijderen",arrTeVerwijderen)
        // window.location.href = "locaties.html";
    })
    

}
const listenToCheck = function() {
  for (i of document.querySelectorAll('input')) {
    i.addEventListener('input', function() {
      if (this.checked) {
        arrTeVerwijderen.push(this.id);
      } else {
        arrTeVerwijderen.splice(arrTeVerwijderen.indexOf(this.id), 1);
      }
      console.log(arrTeVerwijderen);
    });
  }
  
};

const show_Locations = function(data) {
  console.log(data);
  let result = '';
  let eerste = true;
  for (i of data.list) {
    let padding = 'u-pt-clear';
    if (eerste) {
      padding = 'u-pt-16';
    }
    result += `<div class="o-row o-row--md ${padding}">
      <div class="o-container">
        <div class="o-layout o-layout--align-center c-sensor">
          <div class="u-1-of-2 o-layout__item">
              <input type="checkbox" name="${i.name}" value="${i.name}" id=${i.id}>
            <label for="${i.id}" class="c-title">${i.name}</label>
            <p class="c-title c-title--sm u-left u-pl-20">${i.sys.country}</p>
          </div>
          <p class="c-temp--sm u-right u-1-of-2 o-layout__item">${i.main.temp
            .toString()
            .substring(0, 4)}°C</p>
        </div>
  
        <hr class="u-mt-neg" />
      </div>
    </div>`;
    eerste = false;
  }
  document.querySelector('.js-locaties').innerHTML = result;
  listenToCheck();
  listenToDelete();
};

const get_weather = function(data) {
  handleData(
    `http://api.openweathermap.org/data/2.5/group?id=${data}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl`,
    show_Locations
  );
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
