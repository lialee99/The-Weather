const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`starting server at ${port}`)
});
app.use(express.static(`public`))
app.use(express.json({ limit: '1mb' }));

//create and save data to database.db
const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    console.log('I got a request!');
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlng', async (request, response) => {
    const latlng = request.params.latlng.split(',');
    const lat = latlng[0];
    const lng = latlng[1];
    console.log(lat, lng);

    //weather
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lng}/?units=si`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    //air quality
    const air_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`
    const air_response = await fetch(air_url);
    const air_data = await air_response.json();

    const data = {
        weather: weather_data,
        air: air_data
    }
    response.json(data);
});

