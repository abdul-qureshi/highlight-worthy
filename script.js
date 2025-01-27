(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

apiUrl = "https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/scoreboard/TOR/now";

function parseResult(data) {
    const today = new Date().toISOString();
    let closestDate = null;
    let closestDateDiff = Infinity;
    let closestGame = null;

    data.gamesByDate.forEach(gamesByDate => {
        const gameDate = new Date(gamesByDate.games[0].startTimeUTC);
        const diff = Math.abs(new Date(today) - gameDate);

        if (gameDate <= new Date(today) && diff < closestDateDiff) {
            closestDate = gamesByDate.date;
            closestDateDiff = diff;
            closestGame = gamesByDate.games[0];
        }
    });

    if (closestGame && closestGame.gameState != "FUT") {
        const homeTeamLogo = document.getElementById('homeTeamLogo');
        const awayTeamLogo = document.getElementById('awayTeamLogo');
        homeTeamLogo.src = closestGame.homeTeam.logo;
        homeTeamLogo.alt = closestGame.homeTeam.name.default;
        awayTeamLogo.src = closestGame.awayTeam.logo;
        awayTeamLogo.alt = closestGame.awayTeam.name.default;

        if (closestGame.gameState === "LIVE") {
            return `The game is live`;
        }
        let homeTeamScore = closestGame.homeTeam.score;
        let awayTeamScore = closestGame.awayTeam.score;

        if (homeTeamScore > awayTeamScore) {
            return `${closestGame.homeTeam.name.default} won on ${closestDate}.`;
        } else {
            return `${closestGame.awayTeam.name.default} won on ${closestDate}.`;
        }
    } else {
        return 'No recent game found.';
    }
}

fetch(apiUrl)
    .then(response => {
        const resultDiv = document.getElementById('resultText');
        if (response.ok) {
            response.json().then(
                 data => {
                     const resultMessage = parseResult(data);
                     resultDiv.textContent = resultMessage;
                 });
        } else {
            let errorText = 'Error loading data.';
            if (response.type === 'cors') {
                errorText += ' Please enable visit <a href="https://cors-anywhere.herokuapp.com/" target="_blank">this page</a> and then reload this page.';
            }
            resultDiv.innerHTML = errorText;
        }
        
    })
    .catch(error => {
        const resultDiv = document.getElementById('result');
        resultDiv.textContent = 'Error loading data.';
      });
