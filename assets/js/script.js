// // Brad Code Here don't forget GIT STATUS

// var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json');
// var mainDiv = document.getElementById('main-div');

// // Convert to jQuery

// fetch(apiUrl)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     var companyData = data;

//     for (var i = 0; i < companyData.length; i++) {
//       var parks = companyData[i].parks;

//       parks.forEach(function (park) {
//         var parkId = park.id;
//         var parkInfoAPI = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/' + parkId + '/queue_times.json');
//         var universalOrlando = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/65/queue_times.json')
//         var disneyEpcot = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/5/queue_times.json')

//         fetch(disneyEpcot)
//           .then(function (response) {
//             return response.json();
//           })
//           .then(function (data) {
//             var lands = data.lands;

//             for (var j = 0; j < lands.length; j++) {
//               var landName = lands[j].name;
//               var rides = lands[j].rides;

//               for (var k = 0; k < rides.length; k++) {
//                 var rideName = rides[k].name;
//                 var waitTime = rides[k].wait_time;
//                 var isOpen = rides[k].is_open;

//                 if (isOpen === true) {
//                   var para = document.createElement('p');
//                   para.textContent = landName + " is the home of " + rideName +
//                     ", which currently has a wait time of " + waitTime + " minutes.";
//                   mainDiv.append(para);
//                 }
//               }
//             }
//           });
//       });
//     }
//   });








let parkId = {};
var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json')
var parkInfoAPI = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/' + parkId + '/queue_times.json')
var universalOrlando = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/65/queue_times.json')
// var univeralHollywood = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/66/queue_times.json')
// var univeralJapan = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/284/queue_times.json')
// var univeralVolcanoBay = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/67/queue_times.json')
// var disneyMagicKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/6/queue_times.json')
// var disneyEpcot = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/5/queue_times.json')
// var disneyHollywoodStudios = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/7/queue_times.json')
// var disneyAnimalKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/8/queue_times.json')

// parkId is obtained by iterating through apiUrl data and extracting it somehow???




var mainDiv = document.getElementById('main-div')

// Convert to jquery 

fetch(apiUrl)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    //console.log(data)
    var companyData = data;
    //console.log(companyData)
    for (var i = 0; i < companyData.length; i++) {
      var companyName = companyData[i].name
      var companyId = companyData[i].id
      //console.log(companyName)
      //console.log(companyId)
      //console.log("This company is called " + companyName + ". Their company ID is " + companyId + ".")
      var parks = companyData[i].parks
      //console.log(parks)
      parks.forEach(function (park) {
        var parkName = park.name; // Use 'park' instead of 'parks[j]'
        var parkId = park.id;     // Use 'park' instead of 'parks[j]'
        console.log("This park is called " + parkName + ". Their park ID is " + parkId);

      });
      console.log(parkId)

    }
  })



// fetch(universalOrlando)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     console.log(data)
//     var lands = data.lands;

//     for (var i = 0; i < lands.length; i++) {
//       var landName = lands[i].name;
//       //console.log(landName);

//       var rides = lands[i].rides;
//       for (var j = 0; j < rides.length; j++) {
//         var rideName = rides[j].name;
//         //console.log(rideName);


//         var waitTime = rides[j].wait_time;
//         //console.log("Wait Time:", waitTime);

//         var isOpen = rides[j].is_open;
//         //console.log("Is Open:", isOpen);

//         if (isOpen === true) {
//         var para = document.createElement('p');
//         para.textContent = landName + " is the home of " + rideName  + 
//         ", which currently has a wait time of " + waitTime  + " minutes." 
//         mainDiv.append(para)
//         }
//       }

//     }
//   });

































































































// Mark Code Here don't forget GIT STATUS


//AJAX call requires a third party library, jQuery
var city = 'Orlando';
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';
var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial'
var weather = {};



// rewuest for openWeather API
$.ajax({
  url: requestWeatherUrl,
  method: 'GET',
}).then(function (response) {
  // console.log(response);
  weather.temp = response.main.temp
  weather.feels_like = response.main.feels_like
  weather.description = response.weather[0].description
  weather.wind_speed = response.wind.speed;
  weather.humidity = response.main.humidity;
  console.log(weather)
});;