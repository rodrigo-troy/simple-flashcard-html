/*jshint esversion: 8 */
/*jshint browser: true */

/* global console */

class Phrase {
    constructor(json) {
        this.english = json.english || [];
        this.spanish = json.spanish || [];
        this.bold = json.bold || [];
        this.definition = json.definition || '';
    }

    randomSpanishPhrase() {
        if (!this.spanish.length) {
            return '';
        }

        return this.spanish[Math.floor(Math.random() * this.spanish.length)];
    }

    boldEnglishPhrases() {
        return this.english.map(englishPhrase => {
            return this.bold.reduce((phrase, bold) => {
                const regex = new RegExp(`\\b${bold}\\b`, 'ig');
                return phrase.replace(regex, `<b>${bold.toLowerCase()}</b>`);
            }, englishPhrase);
        });
    }
}

class Card {
    constructor(phrase) {
        this.phrase = phrase;
    }

    createCardFront() {
        let divFront = this.createElement('div', 'flip-card-front');
        let p = this.createElement('p', '', this.phrase.randomSpanishPhrase());
        divFront.appendChild(p);
        return divFront;
    }

    createCardBack() {
        let divBack = this.createElement('div', 'flip-card-back');
        this.phrase.boldEnglishPhrases().forEach(text => {
            divBack.appendChild(this.createElement('p', '', '', text));
        });

        if (this.phrase.definition) {
            let span = this.createElement('span', 'info-icon', 'ℹ️');

            span.addEventListener('click', (e) => {
                e.stopPropagation();
                let modal = new bootstrap.Modal(document.getElementById('infoModal'));
                document.querySelector('#infoModal .modal-body').textContent = this.phrase.definition;
                modal.show();
            });

            divBack.appendChild(span);
        }

        return divBack;
    }

    createElement(elementType, className, textContent = '', innerHTML = '') {
        let element = document.createElement(elementType);

        if (className) {
            element.className = className;
        }

        element.textContent = textContent;

        if (innerHTML) {
            element.innerHTML = innerHTML;
        }

        return element;
    }

    createCard() {
        let div = this.createElement('div', 'flip-card');
        let divChild = this.createElement('div', 'flip-card-inner');
        div.appendChild(divChild);

        divChild.appendChild(this.createCardFront());
        divChild.appendChild(this.createCardBack());

        div.addEventListener('click', this.flipCard);
        return div;
    }

    flipCard(e) {
        if (!e.target.closest('.info-icon')) {
            e.currentTarget.classList.toggle('flipped');
        }
    }
}

class App {
    constructor() {
        console.log("Initializing...");
        this.rootElement = document.getElementById('root');
    }

    async init() {
        try {
            const phrases = await this.fetchData('phrases.json');
            this.processPhrases(phrases);
            console.log("Initialized...");
        } catch (err) {
            console.error(err);
        }
    }

    async fetchData(uri) {
        let [response] = await Promise.all([fetch(uri)]);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let json = await response.json();
        console.log("Number of elements: ", json.phrases.length);

        return json['phrases'];
    }

    processPhrases(phraseData) {
        phraseData = phraseData.map(item => new Phrase(item));

        let currentIndex = phraseData.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = phraseData[currentIndex];
            phraseData[currentIndex] = phraseData[randomIndex];
            phraseData[randomIndex] = temporaryValue;
        }

        phraseData
            .map(phrase => new Card(phrase))
            .forEach(card => this.rootElement.appendChild(card.createCard()));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    (new App()).init().then(() => {
        console.log("App started...");
    });
});
