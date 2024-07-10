const currentTime = document.querySelector('.current-time');
const reloadPage = document.querySelector('.rld-page');
let lineStatus = document.querySelector('.status');

const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
};

reloadPage.addEventListener('click', function() {
    window.location.reload();
});

const updateClock = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const colon = (seconds % 2 === 0) ? ":" : `<span style="visibility:hidden">:</span>`;
    const secondsColon = (seconds % 2 === 0) ? `<span style="color:red">:</span>` : `<span style="visibility:hidden">:</span>`;

    const formattedTime = `
        ${formatTime(hours)}${colon}${formatTime(minutes)}${secondsColon}<span style="color:red">${formatTime(seconds)}</span>
    `;

    currentTime.innerHTML = formattedTime;
};

updateClock();
setInterval(updateClock, 1000);

const fetchTrafficData = () => {
    fetch('https://prim.iledefrance-mobilites.fr/marketplace/general-message?StopPointRef=STIF%3AStopPoint%3AQ%3A8768235%3A', {
        headers: {
            'apiKey': 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json(); 
        })
        .then(data => {
            console.log('api results:', data)
            displayTrafficStatus(data);
        })
        .catch(error => {
            console.error('An error occurred:', error);
            lineStatus.textContent = 'Failure while retrieving data. Please check your internet connection and try again.';
            lineStatus.style.color = 'red';
            lineStatus.style.fontSize = '10pt';
        });
}

const smoothTraffic = `Traffic is clear.`;

const displayTrafficStatus = (data) => {
    lineStatus.innerHTML = ''; 

    const generalMessageDelivery = data?.Siri?.ServiceDelivery?.GeneralMessageDelivery?.[0]?.InfoMessage?.[0] ?? null;
    console.log('Alert: ', generalMessageDelivery);

    if (!generalMessageDelivery) {
        lineStatus.textContent = smoothTraffic;
        lineStatus.style.color = 'green';
    } else {
        lineStatus.textContent = `<p style="color:red">Disrupted traffic:</p>\n` + generalMessageDelivery.Content;
    }
    lineStatus.style.fontSize = '12pt';
}

fetchTrafficData();
setInterval(fetchTrafficData, 200000);



// tokenAPI = 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI'

// RER A = 'line:IDFM:C01742' ou 'STIF:Line::C01742:'

// PERTURBATIONS GENERALES = 'https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2'
// 'DisruptionsID' pour ligne RER A = '595d0138-070e-11ef-bcf2-0a58a9feac02'

/* 'MESSAGE GENERAL pour ligne RER A' = 'https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF%3ALine%3A%3AC01742%3A'
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-info_trafic */

// 'stopPoint' pour Achères-ville  = 'STIF:StopPoint:Q:8768235:'

