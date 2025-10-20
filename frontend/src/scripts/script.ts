// import "./chatScroll"
// import "./stt"
// import "./tts"
import { chatScroll } from "../components/transcript/chat-history/chatScroll"
import { speak } from "./tts"

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



