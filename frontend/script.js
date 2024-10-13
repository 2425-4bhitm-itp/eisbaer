const url = "http://localhost:8080/Articles/getArticle/"
let id = document.getElementById("userInput").innerText;

function getArticlePosition() {
    fetch(url + id, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
}