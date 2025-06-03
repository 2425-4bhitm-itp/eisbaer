import {chatScroll} from "../transcript/chat-history/chatScroll";
import {Sender} from "./sender";

export function writeText(chat: HTMLElement, text: string, sender: Sender) {

    if (text === '' || text == null) {
        return;
    }

    let name = document.createElement("p");
    let textField = document.createElement("p");
    let box = document.createElement("div");

    box.classList.add("transcriptEntry");
    name.classList.add("transcriptName");
    textField.classList.add("transcriptText");

    if(sender == Sender.CUSTOMER) {
        box.classList.add("boxRight")
        name.innerHTML = "Sie:";
    } else {
        box.classList.add("boxLeft")
        name.innerHTML = "Eisbär:";
    }

    textField.innerHTML = text;

    box.appendChild(name);
    box.appendChild(textField);

    chat.appendChild(box);

    chatScroll();
}