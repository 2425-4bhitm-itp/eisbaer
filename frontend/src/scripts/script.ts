// import "./chatScroll"
// import "./stt"
// import "./tts"
import { writeText } from "./stt"
import { chatScroll } from "./chatScroll"
import { speak } from "./tts"

const url = "./api/Articles/getArticle/"
const urlOpenSearch = "./search/eisbaer_rag_data/_search";

const DEBOUNCE_TIMEOUT = 1500;

let input = <HTMLInputElement>document.getElementById("userInput");
let output = document.getElementById("queryOutput");
let checkBoxForAI = <HTMLInputElement>document.getElementById("switchToAI");

document.addEventListener("DOMContentLoaded", () => {
    input.addEventListener("input", () => {
        processChange();
    });
});

//only for testing
const username = 'admin';
const password = 'Str0ngP@ssw0rd!';

async function getArticlePositionWithOpenSearch() {
    const query = input.value;

    const requestBody = {
        query: {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: query, // The search term entered by the user
                            fields: ["Bezeichnung1", "Bezeichnung2", "Stellplatz"], // Fields to be searched
                            fuzziness: "AUTO", // Automatic tolerance for typos (string 'AUTO')
                            operator: 'and', // All terms must match
                            prefix_length: 1 // Minimum number of precise starting letters
                        }
                    }
                ],
                should: [
                    {
                        wildcard: {
                            "Bezeichnung1": {
                                "value": `*${query}*`, // Wildcard search for the dynamic query
                                "case_insensitive": true
                            }
                        }
                    },
                    {
                        match: {
                            "Bezeichnung1": {
                                "query": query, // Exact match search for the dynamic query
                                "fuzziness": "AUTO", // Fuzziness for typo tolerance (string 'AUTO')
                                "prefix_length": 1
                            }
                        }
                    }
                ],
                minimum_should_match: 1 // At least one of the should conditions should match
            }
        }
    };


    try {
        // Basis-URL für den Index (anpassen, falls notwendig)
        const urlOpenSearch = './search/articles/_search';


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
        // showArticlePosition(data.hits.hits);
        console.log(data.hits.hits)

    } catch (error) {
        console.error('Fehler beim Abrufen der Suchergebnisse:', error);
    }
}

async function getArticlePositionWithLLM() {
    const query = input.value;

    const requestBody = {
        query: {
            match: {
                text: query
            }
        },
        ext: {
            generative_qa_parameters: {
                llm_model: "gpt-3.5-turbo",
                llm_question: query,
                context_size: 200,
                message_size: 100,
                timeout: 15
            }
        }
    };

    try {
        const urlOpenSearch = "./search/eisbaer_rag_data/_search";

        const response = await fetch(urlOpenSearch, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Suchergebnisse:", data.hits.hits);

        // Extrahiere die Antwort aus den erweiterten Suchergebnissen
        const answer = data.ext?.retrieval_augmented_generation?.answer || "Keine Antwort gefunden.";
        console.log("Antwort:", answer);

        // Verarbeite die Antwort (z. B. anzeigen)
        showArticlePositionLLM(answer);

    } catch (error) {
        console.error("Fehler beim Abrufen der Suchergebnisse:", error);
        throw error
    }
}


// function only works with opensearch response. To use getArticlePosition() remove _source in position notation
function showArticlePosition(position: any[] ) { // TODO: change any
    document.getElementById("queryOutput").innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("outputTable");

    let counter = 1;

    for (let i = 0; i < Math.min(position.length, 5); i++) {
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

        speak(tdName.innerHTML);
        speak("Position: " + tdPosition.innerHTML);

        table.appendChild(tr);

        counter++;
    }

    output.appendChild(table);
}

/*

<div id="0transcript" class="transcriptEntry">
          <p class="transcriptName">Eisbär:</p>
          <p class="transcriptText">Hallo! Wie kann ich dir helfen?</p>
        </div>

 */


function showArticlePositionLLM(position: any) {

    let chat = document.getElementById("chatHistory");

    let box = document.createElement("div");
    box.classList.add("transcriptEntry");
    box.classList.add("boxLeft")

    let name = document.createElement("p");
    name.classList.add("transcriptName");

    let text = document.createElement("p");
    text.classList.add("transcriptText");

    name.innerHTML = "Eisbär:";
    text.innerHTML = position;

    box.appendChild(name);
    box.appendChild(text);

    chat.appendChild(box);
    speak(position);

    chatScroll();
}

async function getArticlePositionWithBackend() {
    const query = input.value;

    try {
        const response = await fetch("./api/Articles/getArticle", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: query
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Suchergebnisse:", data);

        showArticlePositionBackend(data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Suchergebnisse:", error);
    }
}

function showArticlePositionBackend(position: { bezeichnung1: string, stellplatz: string }[]) {
    let chat = document.getElementById("chatHistory");

    let box = document.createElement("div");
    box.classList.add("transcriptEntry");
    box.classList.add("boxLeft");

    let name = document.createElement("p");
    name.classList.add("transcriptName");

    let text = document.createElement("p");
    text.classList.add("transcriptText");

    name.innerHTML = "Eisbär:";
    text.innerHTML = position.map(article => `${article.bezeichnung1} - Stellplatz: ${article.stellplatz}`).join("<br>");

    box.appendChild(name);
    box.appendChild(text);

    chat.appendChild(box);
    speak(text.innerHTML);
    chatScroll();
}

// Debounce code from https://www.freecodecamp.org/news/javascript-debounce-example/
function debounce(func: any, timeout = DEBOUNCE_TIMEOUT) {
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const processChange = debounce(() => {
    if (checkBoxForAI.checked) {
        getArticlePositionWithLLM();
    } else {
        getArticlePositionWithBackend();
    }
    writeText(input.value);
    input.value = "";
});

export { processChange };