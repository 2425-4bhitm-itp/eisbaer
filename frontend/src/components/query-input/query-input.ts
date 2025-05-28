import {createSpeechRecognition} from "./create-speech-recognition";
import {writeText} from "../text-writer/text-writer";
import {getArticlePositionWithLLM} from "../recognition/llm-recognizer";
import {Sender} from "../text-writer/sender";
import {SpeechToText} from "./speechToText";

const DEBOUNCE_TIMEOUT = 1500

const template = `<div id="queryInputContainer">
                  <div id="inputButtons">
                    <input type="text" id="userInput" name="userInput" placeholder="Hier suchen...">
                    <button id="start" name="start"><img src="img/microphone_icon.svg"></button>
                  </div>
              </div>`

class QueryInput extends HTMLElement {

    speechToText = new SpeechToText()
    debouncedProcess: () => void;

    connectedCallback() {
        console.log("connected query input.ts")
        this.innerHTML = template

        const userInput = this.querySelector('input[name="userInput"]') as HTMLInputElement
        const startButton = this.querySelector('button[name="start"]') as HTMLButtonElement
        //const checkBoxForAI = document.querySelector('input[name="switchToAI"]') as HTMLInputElement

        this.debouncedProcess = debounce(async () => {
            let result;
            /*if (checkBoxForAI.checked) {
                result = await getArticlePositionWithLLM(userInput.value);
            } else {
                getArticlePositionWithBackend();
            }*/
            result = await getArticlePositionWithLLM(userInput.value);
            writeText(this.querySelector("chat-history"), userInput.value, Sender.CUSTOMER); //SEND CUSTOM EVENT INSTEAD TO INFORM OUTPUT-CONTAINER
            userInput.value = "";
            writeText(this.querySelector("chat-history"), result, Sender.EISBAER) //SEND CUSTOM EVENT INSTEAD TO INFORM OUTPUT-CONTAINER
        });

        this.debouncedProcess();

        userInput.addEventListener("input", () => {
            this.debouncedProcess()
        });

        startButton.addEventListener("click", () => {
            console.log('Start listening...');
            this.speechToText.start()
        });
    }

}
customElements.define('query-input', QueryInput)

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
