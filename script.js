const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("weatherIcon");
const errorMsg = document.getElementById("errorMsg");
const loading = document.getElementById("loading");

async function getWeather(city) {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found!");
    } else if (response.status === 401) {
      throw new Error("Invalid API key. Please check your configuration.");
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }

  const data = await response.json();
  return data;
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherDesc.textContent = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  weatherCard.classList.remove("hidden");
  errorMsg.classList.add("hidden");
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
  weatherCard.classList.add("hidden");
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  searchBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Searching..." : "Search";
}

async function handleSearch(e) {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  errorMsg.classList.add("hidden");
  weatherCard.classList.add("hidden");
  setLoading(true);

  try {
    const data = await getWeather(city);
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

searchForm.addEventListener("submit", handleSearch);
