import { updateUI } from "./updateUI";

// Saves a trip to local storage
function saveTrip(data) {
    let trips = JSON.parse(localStorage.getItem('trips') || '[]');
    trips.push(data);
    localStorage.setItem('trips', JSON.stringify(trips));
}

// Gets all trips from local storage
function getTrips() {
    return JSON.parse(localStorage.getItem('trips') || '[]');
}

// Removes all trips from local storage
function clearTrips() {
    localStorage.removeItem('trips');
}

// Displays the saved trips on the webpage
async function displaySavedTrips() {
    const trips = getTrips();
    const savedTripsContainer = document.getElementById('saved-trips');
    savedTripsContainer.innerHTML = ''; 
    trips.sort((a, b) => new Date(a.date) - new Date(b.date));
    for(let trip of trips) {
        const tripElem = document.createElement('div');
        tripElem.className = 'trips-saved';
        const today = new Date();
        today.setHours(0, 0, 0, 0);  
        const tripDate = new Date(trip.date);

        if (tripDate < today) {
            tripElem.classList.add('past-trip');
            tripElem.title = "This trip has already happened";
        }
        // display flag
        let flagURL = "";
        try {
            const response = await fetch("/getCountryData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ countryName: trip.geo.countryName }),
            });
            const countryData = await response.json();
            flagURL = countryData.flag;
        } catch (error) {
            console.error('Error fetching flag:', error);
        }

        // Setup trip element's HTML
        tripElem.innerHTML = `
            <span class="delete-icon">🗑️</span>
            <img src="${flagURL}" class="country-flag" alt="Country Flag">
            <p>${trip.geo.name}, ${trip.geo.countryName}</p>
            <p>Date: ${trip.date}</p>`;

        // Delete button logic
        tripElem.querySelector('.delete-icon').addEventListener('click', function(event) {
            event.stopPropagation();
            initiateRemoveTrip(tripElem, trip);
        });

        // Makes the trip clickable to populate form
        if (!tripElem.classList.contains('past-trip')) {
            tripElem.addEventListener('click', () => {
                document.getElementById("destination").value = trip.geo.name;
                document.getElementById("departure-date").value = trip.date; 
                document.querySelector("#trip-form button[type='submit']").click();
            });
        }
        savedTripsContainer.appendChild(tripElem);
    }
}

// Prepares a trip to be deleted
function initiateRemoveTrip(tripElem, targetTrip) {
    tripElem.style.opacity = '0'; 
    setTimeout(() => {
        tripElem.remove();
        removeTrip(targetTrip); 
    }, 300);  
}

// Deletes a trip
function removeTrip(targetTrip) {
    let trips = getTrips();
    const updatedTrips = trips.filter(trip => !(trip.geo.name === targetTrip.geo.name && trip.date === targetTrip.date));
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
}

// When page loads, display saved trips
document.addEventListener('DOMContentLoaded', function() {
    displaySavedTrips();
});

export {saveTrip, getTrips, displaySavedTrips }
