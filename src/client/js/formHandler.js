import { updateUI, updateUIWithError, toggleWeatherDetails } from './updateUI';

async function handleSubmit(event) {
  document.getElementById("loader").style.display = "flex";  // Activate the spinner
  document.getElementById("trip-details").style.display = "none";  // Hide trip details

  event.preventDefault();
  document.getElementById("error-message").innerHTML = '';

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("departure-date").value;

  // Input validation
  if (!destination) {
    updateUIWithError("Please fill out the destination field.");
    return;
  }

  if (!startDate || startDate.length !== 10) { 
    updateUIWithError("Please fill out the date correctly.");
    return;
  }

  const requestData = {
    destination,
    startDate,
  };

  const response = await fetch("/plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    updateUIWithError(errorData.error);
    toggleWeatherDetails(false);
    return;
  }
  try  {
    const data = await response.json();
    toggleWeatherDetails(true);
    updateUI(data, startDate);
    document.getElementById("loader").style.display = "none";  
    document.getElementById("trip-details").style.display = "block";  

  } catch (error) {
    console.error('Error:', error);
    document.getElementById("loader").style.display = "none";  
    document.getElementById("trip-details").style.display = "block"; 
  }
}

$(document).ready(function() {
  // This code will run once the document is ready
  $('#destination').on('input', function() {
      const query = $(this).val();
      if (query.length > 2) { // To avoid too many calls with very short strings
          getSuggestions(query);
      }
  });
});

async function getSuggestions(query) {
  try {
      const response = await fetch("/autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query })
      });
      const suggestions = await response.json();
      populateSuggestions(suggestions);
  } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
  }
}

function populateSuggestions(suggestions) {
  const dataList = document.getElementById('destinations');
  // Clear previous suggestions
  dataList.innerHTML = '';
  
  // Add new suggestions to the datalist
  for (const suggestion of suggestions) {
    const option = document.createElement('option');
    option.value = suggestion.name;
    dataList.appendChild(option);
  }
}

$(function() {
  $("#departure-date").datepicker({
      dateFormat: "yy-mm-dd",
      minDate: 0,        // Minimum date: today
      maxDate: "+6d"     // Maximum date: 6 days from today
  });
});

export { handleSubmit };
