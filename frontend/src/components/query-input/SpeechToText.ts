interface IWindow extends Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
}

export class SpeechToText {

    recognition = new webkitSpeechRecognition();

    constructor() {

        this.recognition.lang = 'de-DE'; // Set language
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript: string = Array.from(event.results)
                .map((result) => (result as SpeechRecognitionResult)[0])
                .map((result) => (result as SpeechRecognitionAlternative).transcript)
                .join('');
            this.write(transcript);
            // processChange();
        };
        this.recognition.onerror = (event) => {
            console.error('Speech Recognition Error:', event.error);
        };
    }
    write(text: string) {
        console.log(text)
    }
    start() {
        this.recognition.start()
    }
}