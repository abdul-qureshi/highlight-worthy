apiUrl = "https://api-web.nhle.com/v1/scoreboard/TOR/now";

function parseResult(data) {
    return data.games.first();
}

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = parseResult(data);
    })
    .catch(error => {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Error loading data.';
      });