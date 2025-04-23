import { chatScroll } from "./chatScroll";

const speechOutput = document.getElementById('userInput') as HTMLInputElement

interface IWindow extends Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

let recognition: SpeechRecognition | null = null;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = 'de-DE'; // Set language
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript: string = Array.from(event.results)
            .map((result) => (result as SpeechRecognitionResult)[0])
            .map((result) => (result as SpeechRecognitionAlternative).transcript)
            .join('');
        speechOutput.value = transcript;
        // processChange();
    };


    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
    };
} else {
    alert('Your browser does not support Speech Recognition.');
}

export function writeText(text: string) {

    if (text === '' || text == null) {
        return;
    }

    let chat = document.getElementById("chatHistory");

    let box = document.createElement("div");
    box.classList.add("transcriptEntry");
    box.classList.add("boxRight")

    let name = document.createElement("p");
    name.classList.add("transcriptName");

    let textField = document.createElement("p");
    textField.classList.add("transcriptText");

    name.innerHTML = "Sie:";
    textField.innerHTML = text;

    box.appendChild(name);
    box.appendChild(textField);

    chat.appendChild(box);

    chatScroll();
}