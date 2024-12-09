const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const output = document.getElementById('output').querySelector('span');

let recognition;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = 'en-US'; // Set language
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        output.textContent = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
    };
} else {
    alert('Your browser does not support Speech Recognition.');
}

startButton.addEventListener('click', () => {
    if (recognition) recognition.start();
});

stopButton.addEventListener('click', () => {
    if (recognition) recognition.stop();
});