import { writeText } from "../text-writer/text-writer";
import { Sender } from "../text-writer/sender";
import { speak } from "scripts/tts";

class OutputContainer extends HTMLElement {

    connectedCallback() {
        this.addEventListener("message", (event: Event) => {
            const customEvent = event as CustomEvent;
            const { text, sender } = customEvent.detail;

            let chatHistory = this.querySelector("#chatHistory") as HTMLElement;

            if (chatHistory) {
                writeText(chatHistory, text, sender);

                if(sender === Sender.EISBAER) {
                    speak(text)
                }
            }
        });
    }

}

customElements.define("output-container", OutputContainer);
