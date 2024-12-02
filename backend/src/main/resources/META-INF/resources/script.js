const url = "http://localhost:8080/Articles/getArticle/"
const urlOpenSearch = "http://localhost:9200/items/_search"

let input = document.getElementById("userInput");
let output = document.getElementById("queryOutput");

//only for testing
const username = 'admin';
const password = 'Str0ngP@ssw0rd!';

function getArticlePosition() {
    let id = input.value;
    console.log(id)
    fetch(url + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then((response) => {
            showArticlePosition(response);
            console.log(response);
        })
        .catch(err => console.error(err));
}

async function getArticlePositionWithOpenSearch() {
    const query = input.value;

    const requestBody = {
        query: {
            multi_match: {
                query: query, // Suchbegriff
                fields: ["Bezeichnung1", "Bezeichnung2", "Stellplatz"], // Felder, die durchsucht werden
                fuzziness: 'AUTO', // Automatische Toleranz für Tippfehler
                operator: 'and', // Begriffe müssen alle vorkommen
                prefix_length: 1 // Mindestanzahl an präzisen Anfangsbuchstaben
            }
        }
    };

    try {
        // Basis-URL für den Index (anpassen, falls notwendig)
        const urlOpenSearch = 'http://localhost:9200/articles/_search';


        // Encode Benutzername und Passwort in Base64 für Basic-Auth
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

        // POST-Anfrage senden
        const response = await fetch(urlOpenSearch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        // Antwortdaten verarbeiten
        const data = await response.json();
        console.log('Suchergebnisse:', data.hits.hits);

        // Treffer zurückgeben
        showArticlePosition(data.hits.hits);

    } catch (error) {
        console.error('Fehler beim Abrufen der Suchergebnisse:', error);
    }
}


// function only works with opensearch response. To use getArticlePosition() remove _source in position notation
function showArticlePosition(position) {

    document.getElementById("queryOutput").innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("outputTable");

    let length = position.length;

    if (length > 5) {
        length = 5;
    }

    let counter = 1;

    for (let i = 0; i < length; i++) {
        let rank = document.createElement("td");
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdPosition = document.createElement("td");
        let tdMiddle = document.createElement("td");

        rank.innerHTML = ("" + counter + ". ");
        tdName.innerHTML = position[i]._source.Bezeichnung1;
        tdName.classList.add("outputName");
        tdMiddle.innerHTML = " ----- ";
        tdPosition.innerHTML = position[i]._source.Stellplatz;
        tdPosition.classList.add("outputPlace");

        tr.appendChild(rank);
        tr.appendChild(tdName);
        tr.appendChild(tdMiddle);
        tr.appendChild(tdPosition);

        table.appendChild(tr);

        counter++;
    }

    output.appendChild(table);
}