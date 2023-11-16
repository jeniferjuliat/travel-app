import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';

import { API_CONFIG } from '../client/js/app.js';

const app = express();
const port = 8082;
module.exports = app;

// Determine the root directory based on the project structure
const rootDir = path.resolve(__dirname, '..', '..');

// Serve the static files from the dist directory
app.use('/', express.static(path.join(rootDir, 'dist')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

// autocomplete geonames
app.post('/autocomplete', async (req, res) => {
    try {
        const { query } = req.body;
        const geoURL = `${API_CONFIG.geonames.baseURL}${query}&maxRows=5&featureClass=P&type=city&username=${API_CONFIG.geonames.username}`;
        const response = await fetch(geoURL);
        const data = await response.json();
        res.send(data.geonames);
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        res.status(500).send({ error: 'Failed to fetch autocomplete suggestions' });
    }
});

//REST Conutries (flag saved-trip)
app.post('/getCountryData', async (req, res) => {
    try {
        const countryName = req.body.countryName;
        const response = await fetch(`https://restcountries.com/v3/name/${countryName}?fullText=true`);
        const data = await response.json();
        console.log(data);
        if(data && data[0] && data[0].flags) {
            res.send({ flag: data[0].flags[0] });
        } else {
            throw new Error('Invalid data from RestCountries');
        }
    } catch (error) {
        console.error('Error fetching country data:', error);
        res.status(500).send({ error: 'Failed to fetch country data' });
    }
});


app.post('/plan', async (req, res) => {
    try {
        const { destination, startDate } = req.body;

        // Fetch data from Geonames
        const geoURL = `${API_CONFIG.geonames.baseURL}${destination}&maxRows=1&featureClass=P&type=city&username=${API_CONFIG.geonames.username}`;
        const geoResponse = await fetch(geoURL);
        if (!geoResponse.ok) {
            throw new Error(`Failed to fetch from Geonames: ${geoResponse.statusText}`);
        }
        const geoData = await geoResponse.json();
        
        if (!geoData.geonames || geoData.geonames.length === 0) {
            res.status(400).json({ error: "Destination not found" });
            return;
        }        

        const { lat, lng } = geoData.geonames[0];

        // Fetch data from Weatherbit
        let weatherData;
        const forecastURL = `${API_CONFIG.weatherbit.forecastURL}lat=${lat}&lon=${lng}&key=${API_CONFIG.weatherbit.apiKey}`;
        const forecastResponse = await fetch(forecastURL);

        if (!forecastResponse.ok) {
            throw new Error(`Failed to fetch forecast from Weatherbit: ${forecastResponse.statusText}`);
        }
        const forecastData = await forecastResponse.json();

        // Encontre o dia exato usando a data inserida pelo usuário
        weatherData = forecastData.data.find(day => day.datetime === startDate);


        // Fetch data from Pixabay
        const pixabayURL = `${API_CONFIG.pixabay.baseURL}${API_CONFIG.pixabay.apiKey}&q=${destination}&image_type=photo&category=places&per_page=10`;
        const pixabayResponse = await fetch(pixabayURL);
        const pixabayData = await pixabayResponse.json();

        if (!pixabayData.hits || pixabayData.hits.length === 0) {
            images = [];
        }
        let images = [];
        if (pixabayData.hits && pixabayData.hits.length) {
        images = pixabayData.hits.map(hit => hit.webformatURL);
        }
        // Process Pixabay results to get an array of image URLs
        const imageUrls = pixabayData.hits.map(image => ({ 
                thumbnail: image.webformatURL,
                large: image.largeImageURL  
        }));


        // Combine data and send response
        const combinedData = {
            geo: geoData.geonames[0],
            weather: weatherData,
            images: imageUrls,
        };

        res.json(combinedData);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: error.message });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
}

