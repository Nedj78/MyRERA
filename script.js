document.addEventListener('DOMContentLoaded', () => {
    const currentTime = document.querySelector('.current-time');
    const reloadPage = document.querySelector('.rld-page');
    const statusPhrase = document.querySelector('.status');
    const fluidTraffic = document.querySelector('.fluidTraffic');
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

    const smoothTraffic = '🟢 Clear';

    const displayTrafficStatus = (status) => {
        statusPhrase.innerHTML = '';

        const generalMessageDelivery = status?.Siri?.ServiceDelivery?.GeneralMessageDelivery?.[0];
        
        if (generalMessageDelivery) {
            const infoMessage = generalMessageDelivery?.InfoMessage?.[0];

            if (infoMessage) {
                const statusDeliveryMessage = infoMessage?.InfoChannelRef?.value;

                if (statusDeliveryMessage === "Perturbation") {
                    const disruptionMessage = infoMessage?.Content?.Message?.[0]?.MessageText?.value;

                    if (disruptionMessage) {
                        statusPhrase.innerHTML = `<p style="color:red">🔴 Perturbation:</p>\n<p>${disruptionMessage}</p>`;
                    } else {
                        statusPhrase.innerHTML = '&nbsp;&nbsp;' + smoothTraffic;
                        statusPhrase.style.color = 'green';
                    }
                } else {
                    statusPhrase.innerHTML = '&nbsp;&nbsp;' + smoothTraffic;
                    statusPhrase.style.color = 'green';
                }
            } else {
                statusPhrase.innerHTML = '&nbsp;&nbsp;' + smoothTraffic;
                statusPhrase.style.color = 'green';
            }
        } else {
            statusPhrase.innerHTML = '&nbsp;&nbsp;' + smoothTraffic;
            statusPhrase.style.color = 'green';
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

        const randomPhrase = [
            "Traffic's flowing like melted butter!",
            "Smooth sailing on the roads today!",
            "Clear roads ahead: smooth as silk!",
            "Traffic's lighter than a feather today!",
            "The roads are as clear as a Sunday morning drive!",
            "Traffic's a breeze today, like sailing on calm seas!",
            "Smooth roads ahead: like driving on a cloud!",
            "Traffic's as light as a feather today!",
            "The train is smoother than a jazz melody!",
            "Driving today is a breeze!",
            "Navigating traffic like a pro!",
            "The roads are wide open!",
            "Traffic's flowing like a gentle stream!",
            "Easy driving today: like a Sunday afternoon stroll!",
            "No traffic jams in sight!",
            "The roads are clear as crystal!",
            "Smooth sailing on the asphalt seas!",
            "Driving today feels like winning a race!",
            "Cruising with no obstacles!",
            "Traffic's on vacation today!",
            "The train is stress-free!",
            "The roads are singing a happy tune!",
            "Smooth traffic: no worries, just driving!",
            "Like driving through an empty city!",
            "Traffic's lighter than a cloud!",
            "The journey is a walk in the park!"
        ];

        const RER_A_LineID = '0a58a9feac02';
        const LineID = announcement?.id;
        
        const generalAnnouncementTitle = announcement?.disruptions[0].title ?? '';
        let generalAnnouncementLastUpdate = announcement?.disruptions[0]?.lastUpdate ?? '';
        const generalAnnouncementCause = announcement?.disruptions[0]?.cause ?? '';
        const generalAnnouncementMessage = announcement?.disruptions[0].message ?? '';
        
        if (!LineID?.includes(RER_A_LineID)) {
            const randomIndex = Math.floor(Math.random() * randomPhrase.length);
            fluidTraffic.innerHTML = `&nbsp;&nbsp;${randomPhrase[randomIndex]}`;
        };
        
        announcementPhrase.style.fontSize = '10pt';

            const reformatDate = (date) => {
                const year = date.substring(0, 4);
                const month = date.substring(4, 6);
                const day = date.substring(6, 8);
            
                return `${day}/${month}/${year}`;
            }
        
        generalAnnouncementLastUpdate = reformatDate(generalAnnouncementLastUpdate);

        announcementPhrase.innerHTML = `${generalAnnouncementLastUpdate}` + `<br><br>` + `<b>${generalAnnouncementTitle}</b>` + `<br><br>` + `⚠️ <u>${generalAnnouncementCause}</u> :` + `<br>` + `&nbsp;&nbsp;${generalAnnouncementMessage}`;
        
        fluidTraffic.style.fontSize = '10pt';
        fluidTraffic.style.color = 'green';
        announcementPhrase.style.fontSize = '10pt';
    };

    fetchTrafficData();
    fetchGeneralAnnouncement();

    setInterval(fetchTrafficData, 200000);
    setInterval(fetchGeneralAnnouncement, 200000);
});





// tokenAPI = 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI'

// RER A = 'line:IDFM:C01742' ou 'STIF:Line::C01742:'

// PERTURBATIONS GENERALES = 'https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2'
// 'DisruptionsID' pour ligne RER A = '595d0138-070e-11ef-bcf2-0a58a9feac02'

/* 'MESSAGE GENERAL (STATUT) pour ligne RER A' = 'https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF%3ALine%3A%3AC01742%3A'
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-info_trafic */

// 'stopPointRef' pour Achères-ville = 'STIF:StopPoint:Q:41528:'
// 'stop_id' pour Achères-ville = 'IDFM:35087'
// Jeux de données plateforme d'échanges : 'https://data.iledefrance.fr/explore/dataset/perimetre-des-donnees-temps-reel-disponibles-sur-la-plateforme-dechanges-stif/table/?q=ach%C3%A8res'
// Jeux de données gares: 'https://prim.iledefrance-mobilites.fr/jeux-de-donnees/emplacement-des-gares-idf-data-generalisee'
// Jeux de données arrêts: 'https://prim.iledefrance-mobilites.fr/jeux-de-donnees/arrets-lignes'

/* PASSAGES EN TEMPS REEL POUR RER A = 'https://prim.iledefrance-mobilites.fr/marketplace/estimated-timetable?LineRef=STIF%3ALine%3A%3AC01742%3A' 
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-requete_globale */


