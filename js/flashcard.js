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
        return this.spanish[Math.floor(Math.random() * this.spanish.length)];
    }

    boldEnglishPhrases() {
        return this.english.map(englishPhrase => {
            return this.bold.reduce((phrase, bold) => {
                const regex = new RegExp(bold, 'ig');
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
                alert(this.phrase.definition);
            })
            divBack.appendChild(span);
        }
        return divBack;
    }

    createElement(elementType, className, textContent = '', innerHTML = '') {
        let element = document.createElement(elementType);
        element.className = className;
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
            let response = await fetch('phrases.json');
            let json = await response.json();
            this.createCards(json['phrases']);
            console.log("Initialized...");
        } catch (err) {
            console.error(err);
        }
    }

    createCards(phraseData) {
        phraseData
            .map(item => new Phrase(item))
            .sort(() => 0.5 - Math.random())
            .map(phrase => new Card(phrase))
            .forEach(card => this.rootElement.appendChild(card.createCard()));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    (new App()).init();
});
