import { chatScroll } from "../components/transcript/chat-history/chatScroll";

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

