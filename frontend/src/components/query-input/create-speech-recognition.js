export function createSpeechRecognition() {
    return window.speechRecognition || window.webkitSpeechRecognition
}