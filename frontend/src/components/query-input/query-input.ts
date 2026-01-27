import {getArticlePositionWithLLM} from "../recognition/llm-recognizer";
import {Sender} from "../text-writer/sender";
import {SpeechToText} from "./speechToText";

const template = `
<div id="queryInputContainer">
  <div id="inputButtons">
    <input type="text" id="userInput" name="userInput" placeholder="Hier suchen...">
    <button id="start" name="start">
      <img src="img/microphone_icon.svg">
    </button>
  </div>
</div>`;

class QueryInput extends HTMLElement {

    private speechToText = new SpeechToText();

    connectedCallback() {
        console.log("connected query input.ts");
        this.innerHTML = template;

        const userInput = this.querySelector<HTMLInputElement>('input[name="userInput"]')!;
        const startButton = this.querySelector<HTMLButtonElement>('button[name="start"]')!;

        userInput.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                await this.processQuery();
            }
        });

        startButton.addEventListener("click", () => {
            console.log("Start listening...");
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
