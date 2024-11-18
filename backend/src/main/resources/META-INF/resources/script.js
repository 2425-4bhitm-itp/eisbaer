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

    // Create the JSON request body
    const requestBody = {
        query: {
            match: {
                Bezeichnung1: {
                    query: query,
                    fuzziness: 'AUTO',
                    operator: 'and',
                    prefix_length: 1
                }
            }
        }
    };


    try {
        // Encode the username and password in Base64 for basic authentication
        const authHeader = 'Basic ' + btoa(`${username}:${password}`);

        // Send the POST request using fetch with the Authorization header
        const response = await fetch(urlOpenSearch, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Search Results:', data.hits.hits);
        return data.hits.hits; // Return or process the hits as needed

    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

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
        tdName.innerHTML = position[i].bezeichnung1;
        tdName.classList.add("outputName");
        tdMiddle.innerHTML = " ----- ";
        tdPosition.innerHTML = position[i].stellplatz;
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