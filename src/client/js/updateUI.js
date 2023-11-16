import { saveTrip, getTrips, displaySavedTrips } from './savedTrips.js';
import { handleSubmit } from './formHandler';

let originalMaxTemp = null;
let originalMinTemp = null;
let currentTripData = null;

// Function to update the User Interface with trip data
function updateUI(data, startDate) {
  document.getElementById('location').textContent = `${data.geo.name}, ${data.geo.countryName}`;

  // Format and display the date
  const dateToShow = new Date(startDate);
  const formattedDate = dateToShow.toLocaleDateString('en-US', { weekday: 'long' }) + ", " + startDate; 
  document.getElementById("trip-date").textContent = formattedDate; 
  currentTripData = {
    geo: data.geo,
    date: startDate, 
    weather: data.weather
  };

  // Display weather icon
  const iconCode = data.weather.weather.icon;
  const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;
  document.getElementById('weather-icon').src = iconUrl;

  // Display max and min temperatures
  originalMaxTemp = data.weather.max_temp;
  originalMinTemp = data.weather.min_temp;
  document.getElementById("max-temperature").textContent = `${Math.round(originalMaxTemp)}°C`;
  document.getElementById("min-temperature").textContent = `${Math.round(originalMinTemp)}°C`;
  
  // Display weather description
  document.getElementById('description').textContent = data.weather.weather.description;

  // Populate images gallery
  const galleryWrapper = document.querySelector('.swiper-wrapper');
  galleryWrapper.innerHTML = '';
  if (data.images.length === 0) {
      galleryWrapper.innerHTML = '<p class="no-images">Images not found</p>';
  } else {
      data.images.forEach((image) => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          const img = document.createElement('img');
          img.src = image.thumbnail;
          img.addEventListener('click', () => showPopupImage(image.large));
          slide.appendChild(img);
          galleryWrapper.appendChild(slide);
      });

      const swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
  }
  updateTemperatureDisplay('C');
}

// Function to display full image on popup
function showPopupImage(src) {
  const popupBackground = document.getElementById('popup-background');
  const popupImage = document.getElementById('popup-image');
  
  popupImage.src = src;
  popupBackground.style.display = 'flex';
  
  popupBackground.addEventListener('click', (e) => {
    if (e.target === popupBackground || e.target === popupImage) {
      popupBackground.style.display = 'none';
    }
  });
}

// Event listener for trip form submission
document.addEventListener("DOMContentLoaded", () => {
  const tripForm = document.getElementById("trip-form");
  const popupWrapper = document.getElementById("popup-wrapper");
  const closePopupButton = document.getElementById("close-popup");

  tripForm.addEventListener("submit", (event) => {
    event.preventDefault(); 
    popupWrapper.style.display = "flex"; 
  });

  closePopupButton.addEventListener("click", () => {
    popupWrapper.style.display = "none"; 
  });
});

// Celsius to Fahrenheit conversion function
function celsiusToFahrenheit(tempC) {
  const tempF = (tempC * 9/5) + 32;
  return Math.round(tempF);
}

// Function to update temperature display unit
function updateTemperatureDisplay(unit) {
    const celsiusBtn = document.getElementById("celsius-btn");
    const fahrenheitBtn = document.getElementById("fahrenheit-btn");
    const maxTempElement = document.getElementById("max-temperature");
    const minTempElement = document.getElementById("min-temperature");

    if (unit === 'C') {
        celsiusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
        maxTempElement.textContent = `${Math.round(originalMaxTemp)}°C`;
        minTempElement.textContent = `${Math.round(originalMinTemp)}°C`;
    } else if (unit === 'F') {
        fahrenheitBtn.classList.add("active");
        celsiusBtn.classList.remove("active");
        maxTempElement.textContent = `${Math.round(celsiusToFahrenheit(originalMaxTemp))}°F`;
        minTempElement.textContent = `${Math.round(celsiusToFahrenheit(originalMinTemp))}°F`;
    }
}

// Event listeners for temperature unit buttons
document.getElementById("celsius-btn").addEventListener("click", () => {
  updateTemperatureDisplay('C');
});

document.getElementById("fahrenheit-btn").addEventListener("click", () => {
  updateTemperatureDisplay('F');
});

// Error handling function
function updateUIWithError(message) {
  const errorMessageContainer = document.getElementById("error-message");
  errorMessageContainer.innerHTML = `<p class="error-message">${message}</p>`;
  document.getElementById("loader").style.display = "none";
}

// Function to toggle visibility of weather details
function toggleWeatherDetails(show) {
  const weatherDetails = document.getElementById("weather-details");
  const gallery = document.getElementById("gallery");
  const popupTitle = document.getElementById("popup-title");

  if (show) {
    weatherDetails.style.display = "grid"; 
    gallery.style.display = "block";       
    popupTitle.style.display = "block";    
  } else {
    weatherDetails.style.display = "none";
    gallery.style.display = "none";
    popupTitle.style.display = "none";
  }
}

// Event listener for saving trips
document.getElementById('save-trip').addEventListener('click', () => {
  saveTrip(currentTripData);
  displaySavedTrips();
  
  // Close the popup after saving the trip
  document.getElementById("popup-wrapper").style.display = "none";
});

export { updateUI, showPopupImage, updateUIWithError, toggleWeatherDetails };
