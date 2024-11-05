const url = "http://localhost:8080/Articles/getArticle/"
let idInput = document.getElementById("userInput");
let output = document.getElementById("outputContainer");

function getArticlePosition() {
    let id = idInput.value;
    console.log(id)
    fetch(url + id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then((response) => {
            showArticlePosition(response);
            console.log(response);
        })
        .catch(err => console.error(err));
}

function showArticlePosition(position) {

    document.getElementById("outputContainer").innerHTML = "";

    let table = document.createElement("table");
    table.classList.add("outputTable");

    let length = position.length;

    if (length > 5) {
        length = 5;
    }

    for (let i = 0; i < length; i++) {
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let tdPosition = document.createElement("td");
        let tdMiddle = document.createElement("td");

        tdName.innerHTML = position[i].bezeichnung1;
        tdName.classList.add("outputName");
        tdMiddle.innerHTML = " ----- ";
        tdPosition.innerHTML = position[i].stellplatz;
        tdPosition.classList.add("outputPlace");

        tr.appendChild(tdName);
        tr.appendChild(tdMiddle);
        tr.appendChild(tdPosition);

        table.appendChild(tr);
    }

    output.appendChild(table);
}