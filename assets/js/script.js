// Park ID Variable for API
var parkId;
var apiUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks.json')
var parkName;
var dataFetched = false; // Flag to indicate if the data has been fetched

var mainDiv = document.getElementById('main-div');

var parks = [];
var parksList = [];
// Object containing data about each park including park ID, Latitude and Longitude.
var parkObjects = [];
// Recent searched parks
var userParks = [];
// Element for autocomplete of park names
var parkListElement = $('#theme-park-list')
// User input for park search
var textInput = $('#text-input')

// API for theme park search (companies)
function fetchThemePark() {
  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (data) {
      var companyData = data;
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
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data: ", error);
    }
  });
}



// Load data into the element for autocomplete list
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
  hideWindows();
  $(element).html(innerElement);
};


// Attach click event listener to the parent ul element and use event delegation in autocomplete list
$('#theme-park-list').on('click', 'li', function () {

  // retrieves data attributes and writes to variables
  parkName = $(this).text();
  parkId = $(this).data('parkid');
  lat = $(this).data('lat');
  lon = $(this).data('lon');
  // runs fuctions with affiliated variables
  getWaitTimes(toggleSort);
  getWeather();
  // clears text input
  $('#text-input').val("")
  // clears the list once selected
  parkListElement.empty();
  getData();

  // object with data about each park for purpose of local storage and recent searches
  userParkData = {
    name: parkName,
    Id: parkId,
    lat: lat,
    lon: lon
  }
  // Check if the park is already in the userParks array based on its name
  var parkExists = userParks.some(function (park) {
    return park.name === parkName;
  });

  if (!parkExists) {
    userParks.push(userParkData); // Add park to array if not already present
    storeData(userParks); // Assuming this function stores data somewhere
    displayUserParks(); // Assuming this function updates the UI with user parks
  }


  // triggers card animation for wait times and weather
  animateWindows();

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



function getWaitTimes(callback) {
  var parkInfoAPI = 'https://corsproxy.io/?' + encodeURIComponent('https://queue-times.com/parks/' + parkId + '/queue_times.json')
  $.ajax({
    url: parkInfoAPI,
    method: "GET",
    success: function (data) {
      var lands = data.lands;

      // iterate through ride to extract name, wait time and boolean if ride is open or closed
      var rideInfo = lands.flatMap(function (land) {
        return land.rides.map(function (ride) {
          return {
            ride: ride.name,
            wait_time: ride.wait_time,
            open: ride.is_open
          }
        })
      }).filter(ride => ride.ride && ride.wait_time); //filters out if name AND wait time doesn't exist

      $('#ride-list').empty();
      $('#wait-list').empty();

      var openRides = rideInfo.filter(ride => ride.open);
      var closedRides = rideInfo.filter(ride => !ride.open);

      // Check if the API returns any ride info
      if (rideInfo.length === 0) {
        $('#alert-box').empty();
        // append this message of park has no information
        $('#alert-box').append('<h2><strong>Information about this park is currently unavailable.</h2>');
        console.log("Ride information is not available for this park");
      } else {
        // Clear previous alert messages
        $('#alert-box').empty();

        // Display both open and closed rides
        displayRidesAndWaitTimes(openRides);
        displayRidesAndWaitTimes(closedRides);
      }

      // displays ride wait times to the DOM
      function displayRidesAndWaitTimes(rides) {
        rides.forEach(function (ride) {
          $('#ride-list').append(`<li>${truncateRideName(ride.ride)}</li>`);
          if (ride.open) {
            $('#wait-list').append(`<li>${ride.wait_time} mins.</li>`);
          } else {
            $('#wait-list').append(`<li>Closed</li>`);
          }
        });
      }

      // truncates ride names so they fit in section 
      function truncateRideName(rideName) {
        // Adjust the maximum length to your preference
        var maxLength = 30;
        if (rideName.length > maxLength) {
          // Truncate and add ellipsis
          return rideName.slice(0, maxLength - 3) + '...';
        }
        return rideName;
      }

    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    }
  });
}




// section helps with sort button to sort alphabetically or by wait times
var currentSortMethod = 'alphabetical';

function toggleSort() {
  // Get the open rides container element
  var rideListContainer = $('#ride-list');
  var waitListContainer = $('#wait-list');

  // Get all the list items inside the containers
  var rides = rideListContainer.find('li');
  var waits = waitListContainer.find('li');

  // Combine ride names and wait times into an array of objects
  var combinedRides = [];
  for (var i = 0; i < rides.length; i++) {
    combinedRides.push({
      ride: $(rides[i]).text(),
      wait: $(waits[i]).text()
    });
  }

  // Sort the combined array
  combinedRides.sort((a, b) => {
    if (currentSortMethod === 'alphabetical') {
      return a.ride.localeCompare(b.ride);
    } else {
      var timeA = a.wait.includes('Closed') ? Infinity : parseInt(a.wait.match(/\d+/)[0]);
      var timeB = b.wait.includes('Closed') ? Infinity : parseInt(b.wait.match(/\d+/)[0]);
      return timeA - timeB;
    }
  });

  // changes text on button 
  const sortButton = $('#sort-btn');
  if (currentSortMethod === 'alphabetical') {
    sortButton.text('Sort by Wait Time');
  } else {
    sortButton.text('Sort Alphabetically');
  }

  // Clear the containers
  rideListContainer.empty();
  waitListContainer.empty();

  // Append the sorted rides and waits to their respective containers
  combinedRides.forEach(ride => {
    rideListContainer.append(`<li>${ride.ride}</li>`);
    waitListContainer.append(`<li>${ride.wait}</li>`);
  });

  // Toggle the sorting method
  currentSortMethod = (currentSortMethod === 'alphabetical') ? 'waitTime' : 'alphabetical';
}



$('#sort-btn').on('click', toggleSort)




// Global variable declaration for getting weather API
var lat;
var lon;
var weatherAPIKey = 'f5ae2638dc599c5d3619396cd657ae93';

// object to store weather data
var weather = {};



// request for openWeather API
function getWeather() {
  console.log(`latitude = ${lat}, longitude = ${lon}`);
  var requestWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + weatherAPIKey + '&units=imperial';

  $.ajax({
    url: requestWeatherUrl,
    method: 'GET',
    success: function (response) {
      console.log(response)
      // Update weather object with the response data
      weather.temp = Math.round(response.main.temp);
      weather.feels_like = Math.round(response.main.feels_like);
      weather.description = response.weather[0].description;
      weather.wind_speed = response.wind.speed;
      weather.humidity = response.main.humidity;
      weather.icon = response.weather[0].icon;

      // Clear previous weather data
      $('#weatherName').empty();

      // Append new weather data
      var weatherContent = `
              <h2 class="mt-5">Weather:</h2>
              <img src="http://openweathermap.org/img/wn/${weather.icon}.png" alt="Weather icon" style="height:10rem;">
              <p>Temperature: ${weather.temp}°F</p>
              <p>Feels Like: ${weather.feels_like}°F</p>
              <p>Condition: ${weather.description}</p>
              <p>Wind Speed: ${weather.wind_speed} MPH</p>
              <p>Humidity: ${weather.humidity}%</p>
          `;

      // Append weather data to the DOM
      $('#weatherName').html(weatherContent);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching weather:", error);
      alert("Failed to retrieve weather data. Please try again.");
    }
  });
}

function displayUserParks() {


  // Clear existing park buttons to prevent duplicates
  $('#recent').empty();

  // iterates over userParks array to be appended to the DOM as buttons
  userParks.forEach(function (park) {
    var parkButton = $('<button>')
      .addClass('button is-info m-1') // Add Bulma classes and a margin
      .text(park.name) // Set the button text to the park name
      // event listener for recent search buttons
      .on('click', function () {
        $("#dialog").fadeOut(1000);
        hideWindows();
        $('#main').children().empty()
        parkName = (park.name)
        parkId = (park.Id)
        console.log(`The button is reading: ${parkId}`);
        lat = (park.lat)
        lon = (park.lon)
        getWaitTimes(toggleSort);
        getWeather();
        animateWindows();

      });

    // Appends buttons in list items to the DOM
    var searchEl = $('<span>')
    $('#recent').append(searchEl);
    searchEl.html(parkButton);

  });
}


// Stores to local storage
function storeData(arr) {
  console.log(arr)
  localStorage.setItem('userParks', JSON.stringify(arr));
}


// Retrieves data from local storage to be displayed
function getData() {
  var storedParks = JSON.parse(localStorage.getItem('userParks'));
  if (storedParks !== null) {
    userParks = storedParks;
  }
}

// clear local storage button
$('#clear-btn').on('click', function () {
  $('#recent').empty();
  localStorage.removeItem('userParks')
  userParks = [];
});


getData();
displayUserParks();

function hideWindows() {
  console.log("hiding windows")
  $("#parkName").slideUp(200);
  $("#weatherName").slideUp(200);
}


function animateWindows() {
  $("#parkName").slideDown(2000);
  $("#weatherName").slideDown(2000);
}






// main div slides down when key is pressed
$("#input-box").keyup(function () {
  $("#main").addClass("show").slideDown(3000)
})

// modal is shown when About button is clicked
$("#btn").click(function () {
  $("#dialog").slideDown().show();
  hideWindows()
})
// modal is styled
$("#dialog").css({ "border": "none", "border-radius": "10px", "padding": "10px", "background": "linear-gradient(45deg,lightblue,lightgreen)", "color": "black", "font-size": "20px", "font-family": "system-ui", "font-weight": "bold" })

// modal will activate fade out animation when close button is clicked
$("#closebtn").click(function () {
  $("#dialog").fadeOut(1000);
})




