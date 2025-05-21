import {speak} from "scripts/tts";
import {chatScroll} from "./chatScroll";

const html = `<div id="chatHistory">
                  <div id="0transcript" class="transcriptEntry, boxLeft">
                      <p class="transcriptName">Eisbär:</p>
                      <p class="transcriptText">Hallo! Wie kann ich dir helfen?</p>
                  </div>
              </div>`

class ChatHistory extends HTMLElement {
    connectedCallback() {
        this.innerHTML = html
    }

    show(answer: string) {
        showArticlePositionLLM(answer)
    }
}

customElements.define("chat-history", ChatHistory)

function showArticlePositionLLM(position: string) {

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

export{ ChatHistory }
