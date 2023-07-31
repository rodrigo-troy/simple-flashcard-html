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

        if (phrase.hasOwnProperty('definition') && phrase['definition'] !== '') {
            const infoIcon = document.createElement('span');
            infoIcon.className = 'info-icon';
            infoIcon.textContent = 'ℹ️';
            divBack.appendChild(infoIcon);

            infoIcon.addEventListener('click', function (e) {
                e.stopPropagation();
                alert(phrase['definition']);
            });
        }

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
        const divBack = getDivBack(phrase);
        divChild.appendChild(divBack);

        div.addEventListener('click', function (event) {
            // Prevent flipping the card when the info icon or popup is clicked
            if (!event.target.closest('.info-icon') && !event.target.closest('.info-popup')) {
                this.classList.add('flipped');
            }
        });

        divBack.addEventListener('click', function (event) {
            event.stopPropagation();
            // If the info icon or popup isn't clicked, flip the card back
            if (!event.target.closest('.info-icon') && !event.target.closest('.info-popup')) {
                div.classList.remove('flipped');
            }
        });


        document.getElementById('root').appendChild(div);
    });
    console.log("Initialized...");
})();
