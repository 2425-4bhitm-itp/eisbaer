import {getArticlePositionWithLLM} from "../recognition/llm-recognizer";
import {Sender} from "../text-writer/sender";
import {SpeechToText} from "./speechToText";
import {interrupt}  from "scripts/tts";

const template = `
<div id="queryInputContainer">
  <div id="inputButtons">
    <input type="text" id="userInput" name="userInput" placeholder="Hier suchen...">
    <button id="start" name="start">
      <img src="img/microphone_icon.svg">
    </button>
  </div>
</div>`;

let startButton: HTMLButtonElement = null;

class QueryInput extends HTMLElement {

    private speechToText = new SpeechToText();

    connectedCallback() {
        console.log("connected query input.ts");
        this.innerHTML = template;

        const userInput = this.querySelector<HTMLInputElement>('input[name="userInput"]')!;
        startButton = this.querySelector('button[name="start"]') as HTMLButtonElement

        userInput.focus();
        userInput.addEventListener('blur', () => {
            setTimeout(() => userInput.focus(), 0); //this is very performance-demanding!
        });

        userInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                await this.processQuery();
            }
        });

        startButton.addEventListener("click", () => {
            console.log("Start listening...");
            interrupt();
            this.speechToText.start();
        });

        document.addEventListener("speech-finished", async () => {
            await this.processQuery();
        });
    }

    private async processQuery() {
        const userInput = this.querySelector<HTMLInputElement>('input[name="userInput"]')!;
        const query = userInput.value.trim();

        if (!query) return;

        this.dispatchEvent(new CustomEvent("message", {
            detail: { text: query, sender: Sender.CUSTOMER },
            bubbles: true,
            composed: true
        }));

        userInput.value = "";

        const result = await getArticlePositionWithLLM(query);

        this.dispatchEvent(new CustomEvent("message", {
            detail: { text: result, sender: Sender.EISBAER },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('query-input', QueryInput);

export function startPulsating() {
    startButton.classList.add("button-pulse");
}

export function stopPulsating() {
    startButton.classList.remove("button-pulse");
}