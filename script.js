
function getWeatherDescription(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }
    else if (code === 1) {
        return "🌤️ Mainly Clear";
    }
    else if (code === 2) {
        return "⛅ Partly Cloudy";
    }
    else if (code === 3) {
        return "☁️ Overcast";
    }
    else if (code === 45 || code === 48) {
        return "🌫️ Foggy";
    }
    else if (code >= 51 && code <= 57) {
        return "🌦️ Drizzle";
    }
    else if (code >= 61 && code <= 67) {
        return "🌧️ Rain";
    }
    else if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }
    else if (code >= 80 && code <= 82) {
        return "🌦️ Rain Showers";
    }
    else if (code === 85 || code === 86) {
        return "🌨️ Snow Showers";
    }
    else if (code >= 95 && code <= 99) {
        return "⛈️ Thunderstorm";
    }
    else {
        return "🌍 Unknown Weather";
    }
}


// =====================================================
// MAIN FUNCTION
// =====================================================

function getWeather() {

    // Get city from input box
    let city = document.getElementById("city").value.trim();

    // Check empty input
    if (city === "") {

        document.getElementById("weatherResult").innerHTML =
            "<p>⚠️ Please enter a city name.</p>";

        return;
    }


    // Show loading message
    document.getElementById("weatherResult").innerHTML =
        "<p>🔄 Loading weather information...</p>";


    // =================================================
    // AJAX REQUEST 1
    // Find the city in INDIA
    // =================================================

    let locationRequest = new XMLHttpRequest();


    /*
       countryCode=IN means:
       Search only inside India.

       This prevents "Bangalore" from being
       matched with an incorrect country.
    */

    let locationURL =
        "https://geocoding-api.open-meteo.com/v1/search" +
        "?name=" +
        encodeURIComponent(city) +
        "&count=10" +
        "&language=en" +
        "&format=json" +
        "&countryCode=IN";


    // Open GET request
    locationRequest.open("GET", locationURL, true);


    // When response arrives
    locationRequest.onload = function () {

        if (locationRequest.status === 200) {

            // Convert JSON response to JavaScript object
            let locationData =
                JSON.parse(locationRequest.responseText);


            // Check whether city exists
            if (!locationData.results ||
                locationData.results.length === 0) {

                document.getElementById("weatherResult").innerHTML =
                    "<p>❌ Indian city not found.</p>" +
                    "<p>Try Bengaluru, Mumbai, Delhi, Chennai, etc.</p>";

                return;
            }


            // Use the first Indian result
            let location = locationData.results[0];


            // Get coordinates
            let latitude = location.latitude;
            let longitude = location.longitude;


            // Get city name
            let cityName = location.name;


            // Get country
            let country = location.country;


            // =================================================
            // SPECIAL CASE:
            // Display Bengaluru instead of Bangalore
            // =================================================

            if (cityName.toLowerCase() === "bangalore") {
                cityName = "Bengaluru";
            }


            // Get weather information
            getWeatherData(
                latitude,
                longitude,
                cityName,
                country
            );
        }

        else {

            document.getElementById("weatherResult").innerHTML =
                "<p>❌ Unable to find the city.</p>";
        }
    };


    // Network error
    locationRequest.onerror = function () {

        document.getElementById("weatherResult").innerHTML =
            "<p>⚠️ Network error. Please check your internet connection.</p>";
    };


    // Send AJAX request
    locationRequest.send();
}



// =====================================================
// GET WEATHER DATA
// =====================================================

function getWeatherData(
    latitude,
    longitude,
    cityName,
    country
) {

    // Create AJAX request
    let weatherRequest = new XMLHttpRequest();


    // Weather API URL
    let weatherURL =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&current=" +
        "temperature_2m," +
        "relative_humidity_2m," +
        "apparent_temperature," +
        "weather_code," +
        "wind_speed_10m";


    // Open GET request
    weatherRequest.open("GET", weatherURL, true);


    // When response arrives
    weatherRequest.onload = function () {

        if (weatherRequest.status === 200) {

            // Convert JSON into JavaScript object
            let weatherData =
                JSON.parse(weatherRequest.responseText);


            // Get current weather
            let current = weatherData.current;


            // Convert weather code
            let weatherDescription =
                getWeatherDescription(
                    current.weather_code
                );


            // =================================================
            // DISPLAY WEATHER
            // =================================================

            document.getElementById("weatherResult").innerHTML =

                "<div class='weather-info'>" +

                "<h2>📍 " +
                cityName +
                ", " +
                country +
                "</h2>" +

                "<p>🌤️ Condition: " +
                weatherDescription +
                "</p>" +

                "<p>🌡️ Temperature: " +
                current.temperature_2m +
                " °C</p>" +

                "<p>💧 Humidity: " +
                current.relative_humidity_2m +
                " %</p>" +

                "<p>🌡️ Feels Like: " +
                current.apparent_temperature +
                " °C</p>" +

                "<p>💨 Wind Speed: " +
                current.wind_speed_10m +
                " km/h</p>" +

                "</div>";
        }

        else {

            document.getElementById("weatherResult").innerHTML =
                "<p>❌ Unable to fetch weather data.</p>";
        }
    };


    // Weather network error
    weatherRequest.onerror = function () {

        document.getElementById("weatherResult").innerHTML =
            "<p>⚠️ Network error. Please try again.</p>";
    };


    // Send AJAX request
    weatherRequest.send();
}
