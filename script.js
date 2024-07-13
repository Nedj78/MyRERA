const currentTime = document.querySelector('.current-time');
const reloadPage = document.querySelector('.rld-page');
const statusPhrase = document.querySelector('.status');
const announcementPhrase = document.querySelector('.announcement');

const formatTime = (time) => (time < 10 ? `0${time}` : time);

reloadPage.addEventListener('click', () => {
    window.location.reload();
});

const updateClock = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedTime = `
        ${formatTime(hours)} : ${formatTime(minutes)} : <span style="color:red">${formatTime(seconds)}</span>
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
        console.log('TrafficStatus:', data);
        displayTrafficStatus(data);
    })
    .catch(error => {
        console.error('An error occurred:', error);
        statusPhrase.textContent = 'Failure while retrieving data. Please check your internet connection and try again.';
        statusPhrase.style.color = 'red';
        statusPhrase.style.fontSize = '10pt';
    });
};

const smoothTraffic = 'All is clear.';

const displayTrafficStatus = (status) => {
    statusPhrase.innerHTML = '';

    const StatusDeliveryMessage = status?.Siri?.ServiceDelivery?.GeneralMessageDelivery?.[0]?.InfoMessage?.[0] ?? null;
    console.log('StatusDeliveryMessage:', StatusDeliveryMessage);

    if (!StatusDeliveryMessage) {
        statusPhrase.textContent = smoothTraffic;
        statusPhrase.style.color = 'green';
    } else {
        statusPhrase.innerHTML = `<p style="color:red">Disrupted traffic:</p>\n${StatusDeliveryMessage.Content}`;
    }
    statusPhrase.style.fontSize = '12pt';
};

const fetchGeneralAnnouncement = () => {
    fetch('https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2', {
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
        console.log('DisruptionAnnouncement:', data);
        displayGeneralAnnouncement(data);
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
};

const displayGeneralAnnouncement = (announcement) => {
    announcementPhrase.innerHTML = '';

    const RER_A_LineID = '595d0138-070e-11ef-bcf2-0a58a9feac02';
    const LineID = announcement?.id;

    const generalAnnouncementTitle = announcement?.applicationPeriods?.title ?? '';
    const generalAnnouncementLastUpdate = announcement?.applicationPeriods?.lastUpdate ?? '';
    const generalAnnouncementCause = announcement?.applicationPeriods?.cause ?? '';
    const generalAnnouncementMessage = announcement?.applicationPeriods?.message ?? '';

    if (LineID !== RER_A_LineID) {
        announcementPhrase.innerHTML = '&nbsp;&nbsp;Nothing to report today 😀';
    } else {
        announcementPhrase.innerHTML = `&nbsp;&nbsp;${generalAnnouncementLastUpdate.Content}\n&nbsp;&nbsp;${generalAnnouncementTitle.Content}\n&nbsp;&nbsp;${generalAnnouncementCause.Content}: ${generalAnnouncementMessage.Content}`;
    }
    announcementPhrase.style.fontSize = '10pt';
};

fetchTrafficData();
fetchGeneralAnnouncement();
setInterval(fetchTrafficData, 200000);
setInterval(fetchGeneralAnnouncement, 200000);


// tokenAPI = 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI'

// RER A = 'line:IDFM:C01742' ou 'STIF:Line::C01742:'

// PERTURBATIONS GENERALES = 'https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2'
// 'DisruptionsID' pour ligne RER A = '595d0138-070e-11ef-bcf2-0a58a9feac02'

/* 'MESSAGE GENERAL pour ligne RER A' = 'https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF%3ALine%3A%3AC01742%3A'
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-info_trafic */

// 'stopPoint' pour Achères-ville  = 'STIF:StopPoint:Q:8768235:'

