// // Brad Code Here don't forget GIT STATUS



var parkId;
var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json')

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
      // console.log(parkObjects)
      for (var i = 0; i < companyData.length; i++) {
        var parks = companyData[i].parks;
        parks.forEach(function (park) {
          // parksList array for autocomplete function
          parksList.push(park.name);
          // parkObjects to write data to li and then parse to variables for further data fetching
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
  // retrieves data attributes and writes to variables
  parkId = $(this).data('parkid');
  lat = $(this).data('lat');
  lon = $(this).data('lon');
  // runs fuctions with affiliated variables
  getWaitTimes();
  getWeather();
  // places selected park completed name in text box
  textInput.value = $(this).text();
  // clears the list once selected
  parkListElement.innerHTML = "";
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

      $('#parkName').empty();

      var openRides = rideInfo.filter(ride => ride.open);
      var closedRides = rideInfo.filter(ride => !ride.open);

      // Checks if API returns ride info based on ID  
      if (rideInfo.length === 0) {
        console.log("Ride information is not available for this park")
      } else {
        // Sort alphabetically and move closed rides to the bottom
        openRides.sort((a, b) => a.ride.localeCompare(b.ride));
        closedRides.sort((a, b) => a.ride.localeCompare(b.ride));

        // Append open rides first
        openRides.forEach(function (ride) {
          var rideElement = $('<p>').text(`${ride.ride}: ${ride.wait_time} mins`);
          $('#parkName').append(rideElement);
        })
        $('#parkName').addClass('showBox').slideDown(2000);
      }

    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
}


var currentSortMethod = "alphabetical";

currentSortMethod = (currentSortMethod === 'alphabetical') ? 'waitTime' : 'alphabetical';


function toggleSort() {
  // Get the open rides container element
  const openRidesContainer = $('#parkName');

  // Get all the paragraphs inside the container
  const openRides = openRidesContainer.find('p');

  // Sort alphabetically or by wait time, keeping closed rides at the bottom
  const sortedRides = Array.from(openRides).sort((a, b) => {
    const rideA = a.textContent.toLowerCase();
    const rideB = b.textContent.toLowerCase();

    // Check the current sorting method
    if (currentSortMethod === 'alphabetical') {
      // If sorting alphabetically, move closed rides to the bottom
      return a.textContent.includes('closed') ? 1 : rideA.localeCompare(rideB);
    } else {
      // If sorting by wait time, move closed rides to the bottom based on wait time
      const timeA = a.textContent.includes('closed') ? Infinity : parseInt(a.textContent.match(/\d+/)[0]);
      const timeB = b.textContent.includes('closed') ? Infinity : parseInt(b.textContent.match(/\d+/)[0]);
      return timeA - timeB;
    }
  });

  // Clear the container and append the sorted rides
  openRidesContainer.empty().append(sortedRides);

  // Toggle the sorting method
  currentSortMethod = (currentSortMethod === 'alphabetical') ? 'waitTime' : 'alphabetical';
}


 



$('#toggle').on('click', toggleSort)







 



















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

  });
}



















// Erics code //

$("#input-box").click(function () {
  $("#main").addClass("show").slideDown(3000);
  $("#parkName").addClass("showBox").slideDown(2000);
  $("#weatherName").addClass("showBox").slideDown(2000);
})


$("#btn").click(function () {
  $("#dialog").slideDown().show();
})

$("#dialog").css({ "border": "none", "border-radius": "10px", "padding": "10px", "background": "linear-gradient(45deg,lightblue,lightgreen)", "color": "black", "font-size": "20px", "font-family": "system-ui", "font-weight": "bold" })

$("#closebtn").click(function () {
  $("#dialog").fadeOut(1000);
})


