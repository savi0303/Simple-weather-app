const apiKey = 'your api'; // Your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Particle Background Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numberOfParticles = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Search Functionality
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
    const searchBtn = document.getElementById('search-btn');

    // Show loading spinner
    searchBtn.classList.add('loading');
    searchBtn.disabled = true;
    loadingSpinner.style.display = 'block';
    errorMessage.style.display = 'none';

    // Reset animations
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach(element => {
        element.classList.remove('visible');
    });

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
        // Hide loading spinner
        searchBtn.classList.remove('loading');
        searchBtn.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.style.display = 'block'; // Show the weather info section

    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;

    // Set weather icon and background based on weather condition
    const weatherCondition = data.weather[0].main.toLowerCase();
    let iconSrc;
    document.body.classList.remove('light-theme', 'dark-theme'); // Reset theme classes
    switch (weatherCondition) {
        case 'clear':
            iconSrc = 'images/clear.png';
            document.body.style.background = 'linear-gradient(135deg, #f5f7fa, #c3cfe2)';
            document.body.classList.add('light-theme');
            break;
        case 'clouds':
            iconSrc = 'images/clouds.png';
            document.body.style.background = 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
            document.body.classList.add('dark-theme');
            break;
        case 'rain':
            iconSrc = 'images/rain.png';
            document.body.style.background = 'linear-gradient(135deg, #4b6cb7, #182848)';
            document.body.classList.add('dark-theme');
            break;
        case 'snow':
            iconSrc = 'images/snow.png';
            document.body.style.background = 'linear-gradient(135deg, #e6f0fa, #b3cde0)';
            document.body.classList.add('light-theme');
            break;
        case 'mist':
        case 'fog':
            iconSrc = 'images/mist.png';
            document.body.style.background = 'linear-gradient(135deg, #d3d3d3, #a9a9a9)';
            document.body.classList.add('light-theme');
            break;
        case 'drizzle':
            iconSrc = 'images/drizzle.png';
            document.body.style.background = 'linear-gradient(135deg, #89b4fa, #3b82f6)';
            document.body.classList.add('dark-theme');
            break;
        default:
            iconSrc = 'images/clouds.png';
            document.body.style.background = 'linear-gradient(135deg, #bdc3c7, #2c3e50)';
            document.body.classList.add('dark-theme');
    }

    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = iconSrc;
    weatherIcon.alt = `Weather Icon: ${data.weather[0].description}`; // Dynamic alt text for accessibility

    // Animate weather info elements
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100); // Staggered animation
    });

    // Debug: Log the weather condition and icon path
    console.log('Weather condition:', weatherCondition);
    console.log('Icon set to:', iconSrc);
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    const weatherInfo = document.getElementById('weather-info');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    weatherInfo.style.display = 'block'; // Show the weather info section for the error message
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
    // Reset background and theme
    document.body.style.background = 'linear-gradient(135deg, #6b48ff, #00ddeb)';
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add('dark-theme');

    // Animate error message
    const animateElements = document.querySelectorAll('.animate-element');
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
}
