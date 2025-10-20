import {ChatHistory} from "../transcript/chat-history/chat-history";

class SearchResult {
    text: string
}

abstract class Recognizer {
    abstract recognize(text: String): Promise<SearchResult[]>
}


//
//
// async function getArticlePositionWithOpenSearch() {
//     const query = input.value;
//
//     const requestBody = {
//         query: {
//             bool: {
//                 must: [
//                     {
//                         multi_match: {
//                             query: query, // The search term entered by the user
//                             fields: ["Bezeichnung1", "Bezeichnung2", "Stellplatz"], // Fields to be searched
//                             fuzziness: "AUTO", // Automatic tolerance for typos (string 'AUTO')
//                             operator: 'and', // All terms must match
//                             prefix_length: 1 // Minimum number of precise starting letters
//                         }
//                     }
//                 ],
//                 should: [
//                     {
//                         wildcard: {
//                             "Bezeichnung1": {
//                                 "value": `*${query}*`, // Wildcard search for the dynamic query
//                                 "case_insensitive": true
//                             }
//                         }
//                     },
//                     {
//                         match: {
//                             "Bezeichnung1": {
//                                 "query": query, // Exact match search for the dynamic query
//                                 "fuzziness": "AUTO", // Fuzziness for typo tolerance (string 'AUTO')
//                                 "prefix_length": 1
//                             }
//                         }
//                     }
//                 ],
//                 minimum_should_match: 1 // At least one of the should conditions should match
//             }
//         }
//     };
//
//
//     try {
//         // Basis-URL für den Index (anpassen, falls notwendig)
//         const urlOpenSearch = './search/articles/_search';
//
//
//         // Encode Benutzername und Passwort in Base64 für Basic-Auth
//         const authHeader = 'Basic ' + btoa(`${username}:${password}`);
//
//         // POST-Anfrage senden
//         const response = await fetch(urlOpenSearch, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': authHeader
//             },
//             body: JSON.stringify(requestBody)
//         });
//
//         if (!response.ok) {
//             throw new Error(`HTTP-Fehler! Status: ${response.status}`);
//         }
//
//         // Antwortdaten verarbeiten
//         const data = await response.json();
//         console.log('Suchergebnisse:', data.hits.hits);
//
//         // Treffer zurückgeben
//         // showArticlePosition(data.hits.hits);
//         console.log(data.hits.hits)
//
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Suchergebnisse:', error);
//     }
// }
//
//
//
// async function getArticlePositionWithBackend() {
//     const query = input.value;
//
//     try {
//         const response = await fetch("./api/Articles/getArticle", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "text/plain"
//             },
//             body: query
//         });
//
//         if (!response.ok) {
//             throw new Error(`HTTP-Fehler! Status: ${response.status}`);
//         }
//
//         const data = await response.json();
//         console.log("Suchergebnisse:", data);
//
//         showArticlePositionBackend(data);
//     } catch (error) {
//         console.error("Fehler beim Abrufen der Suchergebnisse:", error);
//     }
//}

export { Recognizer, SearchResult }