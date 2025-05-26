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
}

customElements.define("chat-history", ChatHistory)


export{ ChatHistory }
