import {startPulsating, stopPulsating} from "./query-input";

export class SpeechToText {
    private recognition: SpeechRecognition;
    private debouncedWrite: (text: string) => void;
    private silenceTimer?: number;

    private isListening = false;
    private hasSubmitted = false;
    private allowWrite = false;

    private static SILENCE_TIMEOUT = 2000;

    constructor() {
        const Ctor =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        this.recognition = new Ctor();
        this.recognition.lang = "de-DE";
        this.recognition.interimResults = true;
        this.recognition.continuous = true;

        this.debouncedWrite = debounce((text: string) => {
            if (this.allowWrite) {
                this.write(text);
            }
        }, 300);

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            if (!this.isListening) return;

            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join("");

            this.debouncedWrite(transcript);
            this.resetSilenceTimer();
        };

        this.recognition.onend = () => {
            this.finishOnce();
        };
    }

    start() {
        this.clearSilenceTimer();
        this.isListening = true;
        this.allowWrite = true;
        this.hasSubmitted = false;
        this.recognition.start();
        startPulsating();
    }

    stop() {
        if (!this.isListening) return;
        this.recognition.stop();
        stopPulsating()
    }

    private finishOnce() {
        if (this.hasSubmitted) return;

        this.hasSubmitted = true;
        this.isListening = false;
        this.allowWrite = false; // 🔒 LOCK writing
        this.clearSilenceTimer();

        document.dispatchEvent(
            new CustomEvent("speech-finished", { bubbles: true })
        );
    }

    private resetSilenceTimer() {
        this.clearSilenceTimer();
        this.silenceTimer = window.setTimeout(() => {
            this.stop();
        }, SpeechToText.SILENCE_TIMEOUT);
    }

    private clearSilenceTimer() {
        if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = undefined;
        }
    }

    private write(text: string) {
        const input = document.querySelector<HTMLInputElement>("#userInput");
        if (input) input.value = text;
    }
}


function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300) {
    let timer: number;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => func(...args), timeout);
    };
}

