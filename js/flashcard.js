/*jshint esversion: 8 */
/*jshint browser: true */
/* global console*/
(function () {
    console.log("Initializing...");

    let httpRequest = new XMLHttpRequest();
    httpRequest.overrideMimeType("application/json");
    httpRequest.open('GET',
                     'phrases.json',
                     true);

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            loadJSON(httpRequest.responseText);
        }
    };

    httpRequest.send(null);

    function loadJSON(response) {
        let json = JSON.parse(response);

        function getDivFront(phrase) {
            const divFront = document.createElement('div');
            divFront.className = 'flip-card-front';
            const divFrontP = document.createElement('p')

            if (phrase.hasOwnProperty('spanish') && Array.isArray(phrase['spanish'])) {
                divFrontP.innerText = phrase['spanish'][Math.floor(Math.random() * phrase['spanish'].length)];
            }

            divFront.appendChild(divFrontP);
            return divFront;
        }

        function getDivBack(phrase) {
            const divBack = document.createElement('div');
            divBack.className = 'flip-card-back';

            if (phrase.hasOwnProperty('english') && Array.isArray(phrase['english'])) {
                phrase['english'].forEach(englishPhrase => {
                    const divBackP = document.createElement('p');
                    if (phrase.hasOwnProperty('bold') && Array.isArray(phrase['bold'])) {
                        phrase['bold'].forEach((bold) => {
                            if (englishPhrase.includes(bold)) {
                                englishPhrase = englishPhrase.replace(bold,
                                                                      '<b>' + bold + '</b>')
                            }
                        });
                    }

                    divBackP.innerHTML = englishPhrase;
                    divBack.appendChild(divBackP);
                });
            }

            return divBack;
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        shuffleArray(json['phrases']);

        json['phrases'].forEach((phrase) => {
            const div = document.createElement('div');
            div.className = "flip-card";

            const divChild = document.createElement('div');
            divChild.className = 'flip-card-inner';

            div.appendChild(divChild);

            divChild.appendChild(getDivFront(phrase));
            divChild.appendChild(getDivBack(phrase));

            document.getElementById('root').appendChild(div);
        });
    }

    console.log("Initialized...");
})();
