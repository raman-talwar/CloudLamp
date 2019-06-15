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
  setColor(data.Temp);
});

const saveLocation = function(data) {};

const listenToSearch = function() {
  document.querySelector('input').addEventListener('input', function() {
    if (this.value.length >= 3) {
      handleData(`http://${IP}/api/v1/locaties/${this.value}`, showLocaties);
      console.log(this.value);
      console.log(this.value.replace(/\s/g, ''));
      let gevonden = document.querySelector(`#${this.value.replace(/\s/g, '')}`);
      if (gevonden) {
        socket.emit('locatie_toevoegen', gevonden.dataset.id);
        console.log(gevonden.dataset.id);
        window.location.href = './index.html';
      }
    }
  });
};

const showLocaties = function(data) {
  console.log(data);
  let result = '';
  for (i of data) {
    result += `<option id="${i.locatienaam.replace(/\s/g, '')}" data-id="${i.locatieid}" value="${
      i.locatienaam
    }">${i.locatieland}</option>`;
  }
  document.querySelector('#steden').innerHTML = result;
  document.querySelector('input').autofocus = true;
};

const init = function() {
  listenToSearch();
};

document.addEventListener('DOMContentLoaded', function() {
  console.info('DOM geladen');
  init();
});
