import { writeText } from "../text-writer/text-writer";
import { Sender } from "../text-writer/sender";

class OutputContainer extends HTMLElement {

    connectedCallback() {
        console.log("connected output-container");

        this.addEventListener("message", (event: Event) => {
            const customEvent = event as CustomEvent;
            const { text, sender } = customEvent.detail;

            console.log("Received message IN OUTPUT CONTAINER:", text, sender);

            let chatHistory = this.querySelector("#chatHistory") as HTMLElement;

            if (chatHistory) {
                writeText(chatHistory, text, sender);
            }
        });
    }

}

customElements.define("output-container", OutputContainer);
