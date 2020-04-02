
let lat, lng;
//確認是否能取得位置
if ('geolocation' in navigator) {
    console.log('goelocation is available');
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lng, weather, air
        try {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            document.getElementById('lat').textContent = lat.toFixed(3);
            document.getElementById('lng').textContent = lng.toFixed(3);
            const api_url = `weather/${lat},${lng}`;
            const response = await fetch(api_url);
            const json = await response.json();

            weather = json.weather.currently;
            air = json.air.results[0].measurements[0];
            //show weather info 
            document.getElementById('summary').textContent = weather.summary;
            document.getElementById('temp').textContent = weather.temperature;
            //show air info 
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;

        } catch (error) {
            console.error(error);
            document.getElementById('summary').textContent = 'None';
            //if no info, set value -1
            air = { value: -1 };
        }

        const data = {
            lat,
            lng,
            weather,
            air
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        console.log(db_json);

    });
} else {
    console.log('goelocation is not available');
}

