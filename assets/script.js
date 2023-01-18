const apiKey = "8bd774bee4a742d72db5807ecc843795";

const container = document.getElementById('page')
let currValue = moment().format("YYYY-MM-DD hh:mm:ss")
let newValue = currValue.split(" ")[0]
const fiveDayWeather = []
const citySearch = []
const savedcitySearch = localStorage.getItem('cityForm') 
let lat
let lon
let cityName = ""
let buttonCount = 0
let buttonArray = []

//console.log(citySearch)
//console.log(savedcitySearch)


//Function to take users text input/search of a city and turn it into a usable variable
function userCityRequest(){
  let searchedCityArray = []

  searchedCityArray.push(savedcitySearch)
  $('#cityForm').on('click', "#btnSearch", function (e){//taget button and search
    const savedDataID = $(this).parent().attr('id')//taget id to use as key
    const savedDataText = $(this).prev().val()//taget text value to use for city
    searchedCityArray.push(savedDataText)//push data to array to be stored and used
    citySearch.push(savedDataText) // push data to be used for javascript
    localStorage.setItem(savedDataID, searchedCityArray) // store user input into local storage
    e.preventDefault()
    //console.log(typeof savedDataID,typeof savedDataText)
    console.log(savedDataText)
    //console.log(typeof citySearch)
    cityLatLon()
  })
}

//function to change user input city into lat/lon for api
function cityLatLon(){
  for(i = 0; i<citySearch.length; i++) //goes through the array of the users input
  cityName = JSON.stringify(citySearch[i]) // gets city name to put into url
  //console.log(typeof cityName)
  console.log(cityName)
  const geoCityCoder = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
  fetch(geoCityCoder)
    .then(response =>{
      //console.log(response)
      return response.json();
    })
   .then(data =>{ //changes the collected data into lat/lon for the next url to use
      lat = data[0].lat;
      lon = data[0].lon;
      //console.log(lat, lon)
      weatherDataCollection()
      todaysWeather()
    })
}

//an api for today's weather
function todaysWeather(){
 const weatherToday = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

 fetch(weatherToday)
  .then (response =>{
    //console.log(response)
    return response.json()
  })
  .then (data => {
    //console.log(data)
    displayToday(data.main)
  })
}

//A function to display today's weather data on the html page
function displayToday(data){
  console.log(data)
  console.log(cityName)
  var city = cityName
  let container = document.getElementById("todayCity") //tagets the place where I want the data to appear
    while (container.firstChild) {
    container.removeChild(container.firstChild)//removes the previous data on the page from the last ciy
  }
  let selectedItems = ["temp", "feels_like", "temp_min", "temp_max"]// tagets the desired data I want
  
  let cityElement = document.createElement("div")//creates divs for the data to appear
  cityElement.innerHTML = "City: " + city
  container.appendChild(cityElement)

  for (let key in data) {// goes through a loop with the data using a key to target and create divs from the desired data
      if (selectedItems.includes(key)) {
          let item = data[key]
          let element = document.createElement("div")
          let titleNode = document.createTextNode(city)
          element.insertBefore(titleNode, element.firstChild)
          element.innerHTML = key+":"+item
          container.appendChild(element)
      }
  }

  //create new button for the city
  let addBtn = document.createElement("button")
  let addBtnText = document.createTextNode((city))
  addBtn.appendChild(addBtnText)
  document.getElementById("addBtn").appendChild(addBtn)
  addBtn.setAttribute("data-set", JSON.stringify(data))

  //save button data to array the array so there can be more than one
  buttonArray.push(addBtn)
  buttonCount++

  //remove oldest button if more than 5 buttons exist
  if (buttonCount > 5) {
      let removeBtn = buttonArray.shift()
      removeBtn.remove()
      buttonCount--
  }
}

//this is for the five day weather forcast
function weatherDataCollection(){
  const apiLink = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  
  fetch(apiLink)
    .then (response =>{//
      //console.log(response);
      return response.json()
    })
    .then(data => {
      //console.log(data);
      parseWeatherData(data.list)
    })
}

//this was partial code from insturctor to break the data down and taget only the wanted data from an array of 40 objects
function parseWeatherData(data){
  //console.log(data)
  data.forEach(obj => {
    const dateObj = moment(obj.dt_txt)
    const currday = dateObj._i
    const newCurrDay = currday.split(" ")[0]
    //console.log(dateObj)
    //console.log(currday.split(" "))
    //console.log(currValue)
    
    console.log(newCurrDay)
     if( newCurrDay !== newValue && fiveDayWeather.length < 5 && !fiveDayWeather.find( day => day.dt_txt.split(" ")[0] === obj.dt_txt.split(" ")[0] ) ){
        currValue = newCurrDay
        fiveDayWeather.push(obj)
        console.log(obj)
    }
  })
  console.log(typeof data[0])
  addDataToPage(fiveDayWeather)
}

//this function adds the five day weather forcast data to the webpage
function addDataToPage(fiveDayWeather, cityName){
  console.log(fiveDayWeather)
  const ul = document.createElement("ul")
  const fiveDayAhead = document.getElementById('fiveDayAhead')
  ul.classList.add("data-list")
  console.log(fiveDayWeather.length)
  console.log(fiveDayWeather)
  for (let i = 0; i < 5; i++) {
    const weatherTime = fiveDayWeather[i]
    const weather = fiveDayWeather[i].main
    const temp = weather.temp
    const feelsLike = weather.feels_like
    const tempMin = weather.temp_min
    const tempMax = weather.temp_max
  
    const target = document.getElementById(`day-${i + 1}`)
    // Find the previous unordered list inside the target element
    const list = document.createElement("ul")
    const tempEl = document.createElement("li")
    tempEl.innerText = `Temp: ${temp}`
    const feelsLikeEl = document.createElement("li")
    feelsLikeEl.innerText = `Feels like: ${feelsLike}`
    const tempMinEl = document.createElement("li")
    tempMinEl.innerText = `Min temp: ${tempMin}`
    const tempMaxEl = document.createElement("li")
    tempMaxEl.innerText = `Max temp: ${tempMax}`
  
    list.appendChild(tempEl)
    list.appendChild(feelsLikeEl)
    list.appendChild(tempMinEl)
    list.appendChild(tempMaxEl)
    target.appendChild(list)
  }
}

userCityRequest()

//weatherDataCollection();


