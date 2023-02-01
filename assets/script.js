const container = document.getElementById("page");
let currValue = moment().format("YYYY-MM-DD hh:mm:ss");
let newValue = currValue.split(" ")[0];
const fiveDay = [];
const citySearch = [];
const savedCities = localStorage.getItem("cityForm");
let lat;
let lon;
let cityName = "";
let buttonCount = 0;
let buttonArray = [];

const apiKey = "8bd774bee4a742d72db5807ecc843795";

function inputCity() {
  let searchedCities = [];

  searchedCities.push(savedCities);
  $("#cityForm").on("click", "#btnSearch", function (e) {
    const savedDataID = $(this).parent().attr("id");
    const savedDataText = $(this).prev().val();
    searchedCities.push(savedDataText);
    citySearch.push(savedDataText);
    localStorage.setItem(savedDataID, searchedCities);
    e.preventDefault();

    coords();
  });
}

// gets coordinates
function coords() {
  for (i = 0; i < citySearch.length; i++)
    cityName = JSON.stringify(citySearch[i]);
  // console log to confirm inout was received.
  console.log(cityName);
  const geoCityCoder = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
  fetch(geoCityCoder)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      lat = data[0].lat;
      lon = data[0].lon;

      fiveDayForecast();
      currentWeather();
    });
}

function currentWeather() {
  const currentWeatherApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(currentWeatherApi)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderCurrent(data.main);
    });
}

function fiveDayForecast() {
  const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      parseWeatherData(data.list);
    });
}

function renderCurrent(data) {
  var city = cityName;
  let container = document.getElementById("todayCity");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  let dataSelected = ["temp", "feels_like", "temp_min", "temp_max"];

  let cityElement = document.createElement("div");
  cityElement.innerHTML = "City: " + city;
  container.appendChild(cityElement);

  for (let key in data) {
    if (dataSelected.includes(key)) {
      let item = data[key];
      let element = document.createElement("div");
      let titleNode = document.createTextNode(city);
      element.insertBefore(titleNode, element.firstChild);
      element.innerHTML = key + ":" + item;
      container.appendChild(element);
    }
  }

  let createButton = document.createElement("button");
  let buttonLabel = document.createTextNode(city);
  createButton.appendChild(buttonLabel);
  document.getElementById("addBtn").appendChild(createButton);
  createButton.setAttribute("data-set", JSON.stringify(data));

  buttonArray.push(createButton);
  buttonCount++;

  if (buttonCount > 5) {
    let removeBtn = buttonArray.shift();
    removeBtn.remove();
    buttonCount--;
  }
}

function parseWeatherData(data) {
  data.forEach((obj) => {
    const dateObj = moment(obj.dt_txt);
    const currday = dateObj._i;
    const newCurrDay = currday.split(" ")[0];

    if (
      newCurrDay !== newValue &&
      fiveDay.length < 5 &&
      !fiveDay.find(
        (day) => day.dt_txt.split(" ")[0] === obj.dt_txt.split(" ")[0]
      )
    ) {
      currValue = newCurrDay;
      fiveDay.push(obj);
    }
  });
  addData(fiveDay);
}

function addData(fiveDay, cityName) {
  const ul = document.createElement("ul");
  ul.classList.add("data-list");
  for (let i = 0; i < 5; i++) {
    const weather = fiveDay[i].main;
    const temp = weather.temp;
    const feelsLike = weather.feels_like;
    const minTemp = weather.temp_min;
    const maxTemp = weather.temp_max;

    const target = document.getElementById(`day-${i + 1}`);

    const list = document.createElement("ul");
    const tempEl = document.createElement("li");
    tempEl.innerText = `Temp: ${temp}`;
    const feelsLikeEl = document.createElement("li");
    feelsLikeEl.innerText = `Feels like: ${feelsLike}`;
    const minTempEl = document.createElement("li");
    minTempEl.innerText = `Min temp: ${minTemp}`;
    const maxTempEl = document.createElement("li");
    maxTempEl.innerText = `Max temp: ${maxTemp}`;

    list.appendChild(tempEl);
    list.appendChild(feelsLikeEl);
    list.appendChild(minTempEl);
    list.appendChild(maxTempEl);
    target.appendChild(list);
  }
}

inputCity();

