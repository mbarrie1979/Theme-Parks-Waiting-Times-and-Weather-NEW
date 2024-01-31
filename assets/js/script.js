// Brad Code Here don't forget GIT STATUS


































































































// Mark Code Here don't forget GIT STATUS


//AJAX call requires a third party library, jQuery
var city = 'Orlando';
var weatherAPI = 'f5ae2638dc599c5d3619396cd657ae93';
var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPI + '&units=imperial'
var weather = {};



// rewuest for openWeather API
$.ajax({
    url: requestWeatherUrl,
    method: 'GET',
}).then(function (response) {
    console.log(response);
    weather.temp = response.main.temp
    weather.feels_like = response.main.feels_like
    weather.description = response.weather[0].description
    weather.wind_speed = response.wind.speed;
    console.log(weather)
});;