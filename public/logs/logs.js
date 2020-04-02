const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    //將GET的資料呈現在頁面上
    for (item of data) {

        const marker = L.marker([item.lat, item.lng]).addTo(mymap);
        //change span to ${object} 
        let txt = `The weather here at (latitude: ${item.lat} &deg;, longitude: ${item.lng}&deg;) is
        ${item.weather.summary} with a temperature of ${item.weather.temperature}&deg; C. ${'<br>'}`

        if (item.air.value < 0) {
            txt += '  No air quality reading.'
        } else {
            txt += `The concentration of particulate matter (${item.air.perameter}) is ${item.air.value}></span>
            ${item.air.unit} last read on ${item.air.lastUpdated}.`
        }

        marker.bindPopup(txt);
    }
    console.log(data);
}

