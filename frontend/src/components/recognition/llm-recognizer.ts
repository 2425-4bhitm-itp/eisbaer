import {Recognizer, SearchResult} from "./recognizer";

class LlmRecognizer extends Recognizer {
    async recognize(text: string): Promise<SearchResult[]> {
        return await getArticlePositionWithLLM(text);
    }
}

async function getArticlePositionWithLLM(query: string) {

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

    const urlOpenSearch = "./search/eisbaer_rag_data/_search";

    console.log(requestBody)

    if(!query || query.trim() === "") {
        return
    }

    const response = await fetch(urlOpenSearch, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    });

    /*if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }*/

    const data = await response.json();
    console.log("Suchergebnisse:", data.hits.hits);

    // Extrahiere die Antwort aus den erweiterten Suchergebnissen
    const answer = data.ext?.retrieval_augmented_generation?.answer || "Keine Antwort gefunden.";
    console.log("Antwort:", answer);

    return answer

}

export {getArticlePositionWithLLM}