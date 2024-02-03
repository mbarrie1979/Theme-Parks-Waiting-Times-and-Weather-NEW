// // Brad Code Here don't forget GIT STATUS



var parkId;
var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json')

// var universalOrlando = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/65/queue_times.json')
// var univeralHollywood = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/66/queue_times.json')
// var univeralJapan = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/284/queue_times.json')
// var univeralVolcanoBay = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/67/queue_times.json')
// var disneyMagicKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/6/queue_times.json')
// var disneyEpcot = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/5/queue_times.json')
// var disneyHollywoodStudios = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/7/queue_times.json')
// var disneyAnimalKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/8/queue_times.json')

// parkId is obtained by iterating through apiUrl data and extracting it somehow?
var dataFetched = false; // Flag to indicate if the data has been fetched

var mainDiv = document.getElementById('main-div');
var parks = [];
var parksList = [];
var parkObjects = [];
var parkListElement = document.querySelector('#theme-park-list')
var textInput = document.querySelector('#text-input')



function fetchThemePark() {
  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (data) {
      var companyData = data;
      console.log(parkObjects)
      for (var i = 0; i < companyData.length; i++) {
        var parks = companyData[i].parks;
        parks.forEach(function (park) {
          parksList.push(park.name);
          parkObjects.push({ name: park.name, id: park.id, latitude: park.latitude, longitude: park.longitude })
        });
        parksList.sort();
        loadData(parksList, parkListElement);

      }
      // console.log(parksList)
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data: ", error);
    }
  });
}



// Load data into the element
// Update the loadData function to include park id in the li element
function loadData(data, element) {
  var innerElement = "";
  data.forEach(function (park) {
    // Assuming parkObjects contains objects with name, id, latitude, and longitude
    var parkObj = parkObjects.find(p => p.name === park);
    if (parkObj) {
      // Append <li> with data attributes for park id, latitude, and longitude
      innerElement += `<li data-parkid="${parkObj.id}" data-lat="${parkObj.latitude}" data-lon="${parkObj.longitude}">${park}</li>`;
    }
  });
  $(element).html(innerElement);
};


// Attach click event listener to the parent ul element and use event delegation
$('#theme-park-list').on('click', 'li', function () {
  console.log($(this).text());
  parkId = $(this).data('parkid'); // This retrieves the data-parkid attribute value
  lat = $(this).data('lat'); // This retrieves the data-parkid attribute value
  lon = $(this).data('lon'); // This retrieves the data-parkid attribute value
  getWaitTimes();
  getWeather();
});




// Filter data based on search text
function filterData(data, searchText) {
  return data.filter(function (x) {
    return x.toLowerCase().includes(searchText.toLowerCase());
  });
}

// Add event listener using jQuery
$(textInput).on('input', function () {
  if (!dataFetched && $(this).val().length > 0) {
    fetchThemePark(); // Fetch data when input is detected and data has not been fetched
    dataFetched = true; // Update the flag
  }

  if ($(this).val().length > 0) {
    var filteredParks = filterData(parksList, $(this).val());
    loadData(filteredParks, parkListElement);
  } else {
    $(parkListElement).html(''); // Clear the list if there's no input
  }
});



// Code below to pull wait times



function getWaitTimes() {
  var parkInfoAPI = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/' + parkId + '/queue_times.json')
  $.ajax({
    url: parkInfoAPI,
    method: "GET",
    success: function (data) {
      // console.log(data);
      var lands = data.lands;

      var rideInfo = lands.flatMap(function (land) {
        return land.rides.map(function (ride) {
          return {
            ride: ride.name,
            wait_time: ride.wait_time,
            open: ride.is_open
          }
        })
      });
      console.log(rideInfo);
      rideInfo.forEach(function(ride){
        console.log(ride);
      })

    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
}



// if (isOpen === true) {
// console.log("This ride is open: " + isOpen)
// var para = document.createElement('p');
// para.textContent = landName + " is the home of " + rideName  + 
// ", which currently has a wait time of " + waitTime  + " minutes." 
// mainDiv.append(para)
// }


// ------------------------------------------------------

// Original code before 2.1.24:

//   fetch(apiUrl) 
//   .then(function (response) {
//    return response.json()
//   })
//   .then(function (data) {
//    //console.log(data)
//    var companyData = data;
//    //console.log(companyData)
//    for (var i = 0; i < companyData.length; i++) {
//     var companyName = companyData[i].name
//     var companyId = companyData[i].id
//     //console.log(companyName)
//     //console.log(companyId)
//     //console.log("This company is called " + companyName + ". Their company ID is " + companyId + ".")
//     var parks = companyData[i].parks
//     //console.log(parks)
//     parks.forEach(function (park) {
//       var parkName = park.name; // Use 'park' instead of 'parks[j]'
//       var parkId = park.id;     // Use 'park' instead of 'parks[j]'
//       //console.log("This park is called " + parkName + ". Their park ID is " + parkId);

//     });
//     //console.log(parkId)  

//    }
//   })



// fetch(universalOrlando)
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     //console.log(data)
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
//           console.log("This ride is open: " + isOpen)
//         // var para = document.createElement('p');
//         // para.textContent = landName + " is the home of " + rideName  + 
//         // ", which currently has a wait time of " + waitTime  + " minutes." 
//         // mainDiv.append(para)
//         }
//       }

//     }
//   });



// -----------------------------------------------

// Older code: 

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








// let parkId = {};
// var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json')
// var parkInfoAPI = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/' + parkId + '/queue_times.json')
// var universalOrlando = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/65/queue_times.json')
// // var univeralHollywood = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/66/queue_times.json')
// // var univeralJapan = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/284/queue_times.json')
// // var univeralVolcanoBay = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/67/queue_times.json')
// // var disneyMagicKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/6/queue_times.json')
// // var disneyEpcot = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/5/queue_times.json')
// // var disneyHollywoodStudios = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/7/queue_times.json')
// // var disneyAnimalKingdom = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/8/queue_times.json')

// // parkId is obtained by iterating through apiUrl data and extracting it somehow???




// var mainDiv = document.getElementById('main-div')

// // Convert to jquery 

// fetch(apiUrl) 
//   .then(function (response) {
//    return response.json()
//   })
//   .then(function (data) {
//    //console.log(data)
//    var companyData = data;
//    //console.log(companyData)
//    for (var i = 0; i < companyData.length; i++) {
//     var companyName = companyData[i].name
//     var companyId = companyData[i].id
//     //console.log(companyName)
//     //console.log(companyId)
//     //console.log("This company is called " + companyName + ". Their company ID is " + companyId + ".")
//     var parks = companyData[i].parks
//     //console.log(parks)
//     parks.forEach(function (park) {
//       var parkName = park.name; // Use 'park' instead of 'parks[j]'
//       var parkId = park.id;     // Use 'park' instead of 'parks[j]'
//       console.log("This park is called " + parkName + ". Their park ID is " + parkId);

//     });
//     console.log(parkId)  

//    }
//   })



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
var lat;
var lon;
// console.log(`latitude = ${lat},longitude = ${lon}`);
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';
// var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherAPIKey + '&units=imperial'
// lat={lat}&lon={lon}
var weather = {};



// rewuest for openWeather API
function getWeather() {
console.log(`latitude = ${lat},longitude = ${lon}`);
  var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + weatherAPIKey + '&units=imperial'
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
<<<<<<< Updated upstream
}
=======





































// Erics code //

$("#input-box").click(function(){
$("#main").addClass("show").slideDown(3000);
$("#parkName").addClass("showBox").slideDown(2000);
$("#weatherName").addClass("showBox").slideDown(2000);
})


 
>>>>>>> Stashed changes
