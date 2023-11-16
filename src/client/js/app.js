const API_CONFIG = {
    geonames: {
      baseURL: 'http://api.geonames.org/searchJSON?q=',
      username: 'jeniferjuliat'
    },
    weatherbit: {
        forecastURL: 'https://api.weatherbit.io/v2.0/forecast/daily?', 
        apiKey: '55175d309d6b436993b30f56ae907d91'
    },
    pixabay: {
      baseURL: 'https://pixabay.com/api/?key=',
      apiKey: '36751075-a294956d47f12307411bcd8a9'
    }
};
  
const mainAppObject = {
    placeholderData: {} 
};
  
export const primaryFunction = () => {
    
};
  
export { API_CONFIG, mainAppObject };
