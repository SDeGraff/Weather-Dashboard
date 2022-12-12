var apiKey = "8bd774bee4a742d72db5807ecc843795";

var submitBtn = document.getElementById('searchBtn')
var currentSection = document.getElementById('weather');
var fiveDaySection = document.getElementById('fiveDay');
var searchText = document.getElementById('cityName');
// var rightTop = document.querySelector('.right-top-child-container')
// var rightBottom = document.querySelector('.right-bottom-child-container')
var results = document.querySelector("#results");
var resultsContainer = document.querySelector(".left-results-container");
var rule = document.querySelector("#rule");
var cityNames = [];


function cityNameButton() {
    if (localStorage.getItem("cityName")) {
        cityNames = JSON.parse(localStorage.getItem("cityName"))
        resultsContainer.innerHTML = '<hr noshade id="rule">'
        for (i = 0; i < cityNames.length; i++) {
            resultsContainer.innerHTML += `<button class="results" id="results" type="text">${cityNames[i]}</button>`
        }
        let results = document.querySelectorAll(".results")
        for (i = 0; i < results.length; i++) {
            results[i].addEventListener("click", function () {
                displayWeather(this.textContent)
                rightTop.style.display = "flex";
                rightBottom.style.display = "block";
                results.style.display = "block";
                rule.style.display = "block";
            })
        }
    }
}

cityNameButton()