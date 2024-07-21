document.addEventListener('DOMContentLoaded', () => {
    const currentTime = document.querySelector('.current-time');
    const reloadPage = document.querySelector('.rld-page');
    const statusPhrase = document.querySelector('.status');
    const announcementPhrase = document.querySelector('.announcement');

    let hasDisruption = false; // Variable d'état pour les perturbations

    const formatTime = (time) => (time < 10 ? `0${time}` : time);

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

    const disruptionsURL = 'https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2';
    const generalMessageURL = 'https://prim.iledefrance-mobilites.fr/marketplace/general-message?StopPointRef=STIF:StopPoint:Q:41528:';
    
    const fetchTrafficData = async () => {
        try {
            const response = await fetch(generalMessageURL, {
                headers: {
                    'apiKey': 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch traffic data');
            const data = await response.json();
            console.log('TrafficStatus:', data);
            displayTrafficStatus(data);
        } catch (error) {
            console.error('An error occurred:', error);
            statusPhrase.innerHTML = 'Failure while retrieving data. Please check your internet connection and try again.';
            statusPhrase.style.color = 'red';
            statusPhrase.style.fontSize = '10pt';
        }
    };

    const fetchDisruptions = async () => {
        try {
            const response = await fetch(disruptionsURL, {
                headers: {
                    'apiKey': 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch disruptions');
            const data = await response.json();
            displayDisruptions(data);
        } catch (error) {
            console.error('An error occurred:', error);
            announcementPhrase.innerHTML = 'Failed to load disruptions';
            announcementPhrase.style.color = 'red';
        }
    };

    const displayTrafficStatus = (status) => {
        statusPhrase.innerHTML = '';
        const generalMessageDelivery = status?.Siri?.ServiceDelivery?.GeneralMessageDelivery?.[0];
        
        if (generalMessageDelivery) {
            const infoMessage = generalMessageDelivery?.InfoMessage?.[0];
            if (infoMessage) {
                const statusDeliveryMessage = infoMessage?.InfoChannelRef?.value;
                if (statusDeliveryMessage === "Perturbation") {
                    const statusMessage = infoMessage?.Content?.Message?.[0]?.MessageText?.value;
                    if (statusMessage) {
                        console.log("Status message: " + statusMessage);
                        statusPhrase.innerHTML = `<p style="color:red">⚠️ ${statusMessage}</p>`;
                        statusPhrase.style.lineHeight = `25px`;
                        statusPhrase.style.color = 'red';
                    } else {
                        statusPhrase.innerHTML = '🟢 Clear';
                        statusPhrase.style.color = 'green';
                    }
                } else {
                    statusPhrase.innerHTML = '🟢 Clear';
                    statusPhrase.style.color = 'green';
                }
            } else {
                statusPhrase.innerHTML = '🟢 Clear';
                statusPhrase.style.color = 'green';
            }
        } else {
            statusPhrase.innerHTML = '🟢 Clear';
            statusPhrase.style.color = 'green';
        }
        statusPhrase.style.fontSize = '12pt';
    };

    const displayDisruptions = (data) => {
        const disruptions = data?.disruptions ?? [];
        const lines = data?.lines ?? [];

        // Trouver les disruptions correspondantes à la gare d'Achères Ville
        const acheresVilleDisruptions = lines
            .find(line => line.id === 'line:IDFM:C01742') // ID de la ligne RER A
            ?.impactedObjects?.find(obj => obj.id === 'stop_point:IDFM:monomodalStopPlace:46647') // ID pour Achères Ville
            ?.disruptionIds ?? [];

        const disruptionDetails = disruptions.filter(d => acheresVilleDisruptions.includes(d.id));

        // Afficher les perturbations de la gare d'Achères Ville 
        if (disruptionDetails.length > 0) {
            announcementPhrase.innerHTML = '<h3><strong>Disruptions at Achères Ville:</strong></h3><ul>' +
                disruptionDetails.map(d => `<li><strong>${d.title}:</strong> ${d.message}</li>`).join('') +
                '</ul>';
            hasDisruption = true; 
        } else {
            hasDisruption = false; 
            console.log(hasDisruption + ': No current disruptions for Achères Ville.');
        }
    };

    const displayGeneralAnnouncement = () => {
        if (!hasDisruption) {
            console.log("yooo" + hasDisruption)
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

            const randomIndex = Math.floor(Math.random() * randomPhrase.length);
            const randomAnnouncement = randomPhrase[randomIndex];

            announcementPhrase.innerHTML = randomAnnouncement;
            announcementPhrase.style.color = "green";
            announcementPhrase.style.fontSize = "10pt";
            announcementPhrase.style.padding = "0 0 0 12px";
        } else {
            announcementPhrase.innerHTML = '';
        }
    };

    const updateDisplay = async () => {
        await fetchDisruptions();
        displayGeneralAnnouncement();
    };

    fetchTrafficData();
    updateDisplay();

    setInterval(fetchTrafficData, 300000); 
    setInterval(updateDisplay, 300000); 

    reloadPage.addEventListener('click', () => {
        window.location.reload();
    });
});




// tokenAPI = 'e4LffmFrHh1EDYzQecdMQHITH0xSdIuI'

// RER A = 'line:IDFM:C01742' ou 'STIF:Line::C01742:'

// PERTURBATIONS GENERALES = 'https://prim.iledefrance-mobilites.fr/marketplace/disruptions_bulk/disruptions/v2'
// 'DisruptionsID' pour ligne RER A = '595d0138-070e-11ef-bcf2-0a58a9feac02'

/* 'MESSAGE GENERAL (STATUT) pour ligne RER A' = 'https://prim.iledefrance-mobilites.fr/marketplace/general-message?LineRef=STIF%3ALine%3A%3AC01742%3A'
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-info_trafic */

// 'stopPointRef' pour Achères-ville = 'STIF:StopPoint:Q:41528:' ou 'stop_point.id' = 'IDFM:monomodalStopPlace:46647'
// 'stop_id' pour Achères-ville = 'IDFM:35087'
// Jeux de données plateforme d'échanges : 'https://data.iledefrance.fr/explore/dataset/perimetre-des-donnees-temps-reel-disponibles-sur-la-plateforme-dechanges-stif/table/?q=ach%C3%A8res'
// Jeux de données gares: 'https://prim.iledefrance-mobilites.fr/jeux-de-donnees/emplacement-des-gares-idf-data-generalisee'
// Jeux de données arrêts: 'https://prim.iledefrance-mobilites.fr/jeux-de-donnees/arrets-lignes'

/* PASSAGES EN TEMPS REEL POUR RER A = 'https://prim.iledefrance-mobilites.fr/marketplace/estimated-timetable?LineRef=STIF%3ALine%3A%3AC01742%3A' 
https://prim.iledefrance-mobilites.fr/apis/idfm-ivtr-requete_globale */


