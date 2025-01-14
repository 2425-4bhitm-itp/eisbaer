let checkIfFirstTime = true;

const beginningText = document
     .getElementsByClassName("transcriptText")[0]
     .innerHTML;

console.log("textToBeSpoken: " + beginningText);

//Log all available voices
var voicelist = responsiveVoice.getVoices();
console.log(voicelist);

//Set voice
responsiveVoice.setDefaultVoice("Deutsch Male");

function speak(textToBeSpoken) {
        responsiveVoice.speak(textToBeSpoken);
        responsiveVoice.cancel();
    }

document.body.addEventListener("click", function() {
     if(checkIfFirstTime) {
         speak(beginningText);
         checkIfFirstTime = false;
     }
});
