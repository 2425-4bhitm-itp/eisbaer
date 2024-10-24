const url = "http://localhost:8080/Articles/getArticle/"
let idInput = document.getElementById("userInput");
let output = document.getElementById("outputPlace");

function getArticlePosition() {
    let id = idInput.value;
    console.log(id)
    fetch(url + id, {
        method: 'GET',
    })
        .then(response => response.text())
        .then((response) => {
            showArticlePosition(response);
        })
        .catch(err => console.error(err));
}

function showArticlePosition(position) {
    output.innerText = position;
}