const template = `<div id="queryInputContainer">
                  <div id="inputButtons">
                    <input type="text" id="userInput" name="userInput" placeholder="Hier suchen...">
                    <button id="start"><img src="img/microphone_icon.svg"></button>
                  </div>
              </div>`

class QueryInput extends HTMLElement {

    recognition = new SpeechRecognition();

    connectedCallback() {
        console.log("connected query input.ts")
        this.innerHTML = template

        const startButton = document.getElementById('start') as HTMLButtonElement

        startButton.addEventListener('click', () => {
            console.log('Start listening...');
            this.recognition.start();
        });
    }
}
customElements.define('query-input', QueryInput)

