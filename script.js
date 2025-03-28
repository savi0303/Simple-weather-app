const apiKey = '636017c33a211815710a1c5179d690d1'; // Your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        getWeather(city);
    }
});

// Allow pressing Enter key to search
document.getElementById('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = document.getElementById('city-input').value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

async function getWeather(city) {
    const loadingSpinner = document.getElementById('loading');
    const weatherInfo = document.getElementById('weather-info');
    const errorMessage = document.getElementById('error-message');

    // Show loading spinner and hide weather info
    loadingSpinner.style.display = 'block';
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
            errorMessage.style.display = 'none';
        } else {
            throw new Error(data.message || 'City not found');
        }
    } catch (error) {
        showError(error.message);
    } finally {
        // Hide loading spinner after the request completes
        loadingSpinner.style.display = 'none';
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.style.display = 'block';

    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;

    // Set weather icon based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    let iconSrc;
    switch (weatherCondition) {
        case 'clear':
            iconSrc = 'images/clear.png';
            break;
        case 'clouds':
            iconSrc = 'images/clouds.png';
            break;
        case 'rain':
            iconSrc = 'images/rain.png';
            break;
        case 'snow':
            iconSrc = 'images/snow.png';
            break;
        case 'mist':
        case 'fog':
            iconSrc = 'images/mist.png';
            break;
        case 'drizzle':
            iconSrc = 'images/drizzle.png';
            break;
        default:
            iconSrc = 'images/clouds.png'; // Default to clouds.png for unhandled conditions
    }

    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = iconSrc;
    weatherIcon.alt = `Weather Icon: ${data.weather[0].description}`; // Dynamic alt text for accessibility

    // Debug: Log the weather condition and icon path
    console.log('Weather condition:', weatherCondition);
    console.log('Icon set to:', iconSrc);
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    document.getElementById('weather-info').style.display = 'block';
    // Clear previous weather data
    document.getElementById('city-name').textContent = '';
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = '';
    document.getElementById('humidity').textContent = '';
    document.getElementById('wind-speed').textContent = '';
    // Reset the weather icon to the default
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = 'images/weather-icon.png';
    weatherIcon.alt = 'Weather Icon';
}