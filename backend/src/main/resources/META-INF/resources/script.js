const url = "http://localhost:8080/Articles/getArticle/"
let idInput = document.getElementById("userInput");
let output = document.getElementById("outputContainer");

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

    let table = document.createElement("table");


    for (let i = 0; i < position.length; i++) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdPosition = document.createElement("td");
        tdName.innerHTML = position[i]["bezeichnung1"];
        tdName.classList.add("outputName");
        tdPosition.innerHTML = position[i]["stellplatz"];
        tdPosition.classList.add("outputPlace");
        tr.appendChild(tdName);
        tr.appendChild(tdPosition);
        table.appendChild(tr);
    }

    output.appendChild(table);
}