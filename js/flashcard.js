/*jshint esversion: 8 */
/*jshint browser: true */
/* global console*/
(async () => {
    console.log("Initializing...");

    const response = await fetch('phrases.json');
    const json = await response.json();

    function getDivFront(phrase) {
        const divFront = document.createElement('div');
        divFront.className = 'flip-card-front';
        const divFrontP = document.createElement('p');

        if (phrase.hasOwnProperty('spanish') && Array.isArray(phrase['spanish'])) {
            divFrontP.textContent = phrase['spanish'][Math.floor(Math.random() * phrase['spanish'].length)];
        }

        divFront.appendChild(divFrontP);
        return divFront;
    }

    function getDivBack(phrase) {
        const divBack = document.createElement('div');
        divBack.className = 'flip-card-back';

        if (phrase.hasOwnProperty('english') && Array.isArray(phrase['english'])) {
            phrase['english'].map(englishPhrase => {
                const divBackP = document.createElement('p');
                if (phrase.hasOwnProperty('bold') && Array.isArray(phrase['bold'])) {
                    phrase['bold'].map(bold => {
                        if (englishPhrase.includes(bold)) {
                            englishPhrase = englishPhrase.replace(bold, `<b>${bold}</b>`);
                        }
                    });
                }

                divBackP.innerHTML = englishPhrase;
                divBack.appendChild(divBackP);
            });
        }

        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon';
        infoIcon.textContent = 'ℹ️';
        divBack.appendChild(infoIcon);

        infoIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            if (phrase.hasOwnProperty('definition') && phrase['definition'] !== '') {
                alert(phrase['definition']);
            } else {
                alert('No definition available.');
            }
        });

        return divBack;
    }

    function shuffleArray(array) {
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    json['phrases'] = shuffleArray(json['phrases']);

    json['phrases'].forEach(phrase => {
        const div = document.createElement('div');
        div.className = "flip-card";

        const divChild = document.createElement('div');
        divChild.className = 'flip-card-inner';

        div.appendChild(divChild);

        divChild.appendChild(getDivFront(phrase));
        divChild.appendChild(getDivBack(phrase));

        document.getElementById('root').appendChild(div);
    });
    console.log("Initialized...");
})();
