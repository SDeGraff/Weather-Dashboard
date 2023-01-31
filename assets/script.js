const apiKey = "8bd774bee4a742d72db5807ecc843795";

const container = document.getElementById('page')
let currValue = moment().format("YYYY-MM-DD hh:mm:ss")
let newValue = currValue.split(" ")[0]
const fiveDay = []
const citySearch = []
const savedcitySearch = localStorage.getItem('cityForm') 
let lat
let lon
let cityName = ""
let buttonCount = 0
let buttonArray = []
let searchedCityArray = []

  searchedCityArray.push(savedcitySearch)
  $('#cityForm').on('click', "#btnSearch", function (e){
    const savedDataID = $(this).parent().attr('id')
    const savedDataText = $(this).prev().val()
    searchedCityArray.push(savedDataText)
    citySearch.push(savedDataText)
    localStorage.setItem(savedDataID, searchedCityArray) 
    e.preventDefault()

    console.log(savedDataText)

    cityLatLon()
  });



function cityLatLon(){
  for(i = 0; i<citySearch.length; i++) 
  cityName = JSON.stringify(citySearch[i]) 

  console.log(cityName)
  const geoCityCoder = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
  fetch(geoCityCoder)
    .then(response =>{
    
      return response.json();
    })
   .then(data =>{
      lat = data[0].lat;
      lon = data[0].lon;
    
      weatherDataCollection()
      todaysWeather()
    });
}


function todaysWeather(){
 const weatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

 fetch(weatherToday)
  .then (response =>{
 
    return response.json()
  })
  .then (data => {
   
    displayToday(data.main)
  });
}

function displayToday(data){
  console.log(data)
  console.log(cityName)
  var city = cityName
  let container = document.getElementById("todayCity") 
    while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
  let selectedItems = ["temp", "feels_like", "temp_min", "temp_max"]
  
  let cityElement = document.createElement("div")
  cityElement.innerHTML = "City: " + city
  container.appendChild(cityElement)

  for (let key in data) {
      if (selectedItems.includes(key)) {
          let item = data[key]
          let element = document.createElement("div")
          let titleNode = document.createTextNode(city)
          element.insertBefore(titleNode, element.firstChild)
          element.innerHTML = key+":"+item
          container.appendChild(element)
      }
  }
  
  let addBtn = document.createElement("button")
  let addBtnText = document.createTextNode((city))
  addBtn.appendChild(addBtnText)
  document.getElementById("addBtn").appendChild(addBtn)
  addBtn.setAttribute("data-set", JSON.stringify(data))

 
  buttonArray.push(addBtn)
  buttonCount++

  
  if (buttonCount > 5) {
      let removeBtn = buttonArray.shift()
      removeBtn.remove()
      buttonCount--
  }
}


function weatherDataCollection(){
  const apiLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  
  fetch(apiLink)
    .then (response =>{
      return response.json()
    })
    .then(data => {

      parseWeatherData(data.list)
    })
}


function parseWeatherData(data){

  data.forEach(obj => {
    const dateObj = moment(obj.dt_txt)
    const currday = dateObj._i
    const newCurrDay = currday.split(" ")[0]

    
    console.log(newCurrDay)
     if( newCurrDay !== newValue && fiveDay.length < 5 && !fiveDay.find( day => day.dt_txt.split(" ")[0] === obj.dt_txt.split(" ")[0] ) ){
        currValue = newCurrDay
        fiveDay.push(obj)
        console.log(obj)
    }
  })
  console.log(typeof data[0])
  addData(fiveDay)
}


function addData(fiveDay, cityName){
  console.log(fiveDay)
  const ul = document.createElement("ul")
  const fiveDayAhead = document.getElementById('fiveDayAhead')
  ul.classList.add("data-list")
  console.log(fiveDay.length)
  console.log(fiveDay)
  for (let i = 0; i < 5; i++) {
    const weatherTime = fiveDay[i]
    const weather = fiveDay[i].main
    const temp = weather.temp
    const feelsLike = weather.feels_like
    const minTemp = weather.temp_min
    const maxTemp = weather.temp_max
  
    const target = document.getElementById(`day-${i + 1}`)
   
    const list = document.createElement("ul")
    const tempEl = document.createElement("li")
    tempEl.innerText = `Temp: ${temp}`
    const feelsLikeEl = document.createElement("li")
    feelsLikeEl.innerText = `Feels like: ${feelsLike}`
    const minTempEl = document.createElement("li")
    minTempEl.innerText = `Min temp: ${minTemp}`
    const maxTempEl = document.createElement("li")
    maxTempEl.innerText = `Max temp: ${maxTemp}`
  
    list.appendChild(tempEl)
    list.appendChild(feelsLikeEl)
    list.appendChild(minTempEl)
    list.appendChild(maxTempEl)
    target.appendChild(list)
  }
}

userCityRequest()




