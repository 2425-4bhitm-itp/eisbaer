// import "./chatScroll"
// import "./stt"
// import "./tts"
import { writeText } from "./stt"
import { chatScroll } from "../components/transcript/chat-history/chatScroll"
import { speak } from "./tts"
import {ChatHistory} from "../components/transcript/chat-history/chat-history";


const url = "./api/Articles/getArticle/"
const urlOpenSearch = "./search/eisbaer_rag_data/_search";

let input = <HTMLInputElement>document.getElementById("userInput");
let output = document.getElementById("queryOutput");
let checkBoxForAI = <HTMLInputElement>document.getElementById("switchToAI");

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded...")
});

//only for testing
const username = 'admin';
const password = 'Str0ngP@ssw0rd!';



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



