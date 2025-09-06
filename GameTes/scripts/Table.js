import { PlayingCard } from './PlayingCard.js';

export class Table {
	// set of 81 cards
	completeDeck

	// reference to completeDeck for purpose of removing cards
	deck;

	TABLE_SIZE = 12;

	upcards;

	// when three additional cards are dealt when player is "stuck"
	upcardBuild;

	match;

	// number of matches found
	score;

	// used for calculated play time
	startTime;

	endTime;

	get deckEmpty() {
		return this.deck.length === 0;
	}

	get full() {
		return this.upcard.length === TABLE_SIZE;
	}

	constructor() {
		this.deck = [];
		this.upcards = [];
		this.upcardBuild = [];
		this.score = 0;

		this.createDeck();
		this.setTable();
	}

	setTable() {
		this.shuffleDeck();
		this.deck.splice(15);
		this.dealUpcards();
	}

	createDeck() {
		let id = 1;
		const letters = ["A", "B", "C"];
		const counts = [1, 2, 3];
		const rotations = ["Positive", "Negative", "Zero"];
		const borders = ["Dotted", "Solid", "None"];

		for (let i = 0; i < letters.length; i++) {
			for (let j = 0; j < counts.length; j++) {
				for (let k = 0; k < rotations.length; k++) {
					for (let l = 0; l < borders.length; l++) {
						this.deck.push(new PlayingCard(
							id++,
							letters[i],
							counts[j],
							rotations[k],
							borders[l],
						));
					}
				}
			}
		}

		this.completeDeck = this.deck.slice();
	}

	shuffleDeck() {
		 for (let i = this.deck.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
	}

	dealUpcards() {
		for (let i = 0; i < this.TABLE_SIZE; i++) {
			this.upcards.push(this.deck.pop());
		}
	}

	condenseUpcards() {
		const count = this.upcards.reduce((a, b) => b.letter === " " ? a + 1 : a, 0);

		let c = 0;
		for (let i = 0; i < this.upcards.length; i++) {
			if (this.upcards[i] === " ") { c++; }
		}

		const swap = (i, j) => [this.upcards[i], this.upcards[j]] = [this.upcards[j], this.upcards[i]];
		const upperBound = this.upcards.length - 1;
		const lowerBound = this.upcards.length - 3;

		for (let right = upperBound, left = right - 1; right >= lowerBound; right--) {
			if (this.upcards[right].letter === " ") {
				continue;
			}
			while (this.upcards[left].letter !== " ") {
				left--;
			}
			swap(left, right);
		}

		this.upcards.splice(this.TABLE_SIZE);
	}

	activateUpcardBuild() {
		this.upcards.push(this.deck.pop());
		this.upcards.push(this.deck.pop());
		this.upcards.push(this.deck.pop());;
	}

	deactivateUpcardBuild() {
		Ui.destroyUpcardBuild();
		table.upcards.splice(15);
	}

	findMatch() {
			for (let i = 0; i < this.upcards.length; i++) {
				for (let j = 0; j < this.upcards.length; j++) {
					for (let k = 0; k < this.upcards.length; k++) {
						if (i === j || i === k || j === k) {
							continue;
						}

						if (
							this.upcards[i].letter === " " ||
							this.upcards[j].letter === " " ||
							this.upcards[k].letter === " "
						) {
							continue;
						}

						const matchValid = this.matchValid([i, j, k]);

						if (matchValid) {
							return [i ,j, k];
						}
					}
				}
			}

			return false;
	}

	matchValid(indices) {
		const x = this.upcards[indices[0]];
		const y = this.upcards[indices[1]];
		const z = this.upcards[indices[2]];

		const props = ["letter", "count", "rotation", "border"];
		const testResults = [];
		const passesAll = () => testResults.reduce((x, y) => x && y);

		props.forEach((prop) => {
			const equal = 	Boolean (
				x[prop] === y[prop] &&
				y[prop] === z[prop]
			);
			const  different = Boolean(
				x[prop]!== y[prop] &&
				x[prop] !== z[prop] &&
				y[prop] !== z[prop]
			);
			testResults.push(equal || different);
		});

		return passesAll();
	}

	performMatch(indices) {
		if (!this.deckEmpty) {
			indices.forEach((i) => this.upcards[i] = this.deck.pop());
		} else {
			const finalCard = new PlayingCard(82, " ", 1, "None", "None");
			indices.forEach((i) => this.upcards[i] = finalCard);
		}

		this.matchExists = this.findMatch();
		this.score++;
	}

	performMatchNoRestock(indices) {
		const finalCard = new PlayingCard(82, " ", 1, "None", "None");
		indices.forEach((i) => this.upcards[i] = finalCard);

		this.matchExists = this.findMatch();
		this.score++;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	stopTimer() {
		this.endTime = Date.now();
	}

	calcTime () {
		this.stopTimer();

		const diff = this.endTime - this.startTime;
		const min = Math.trunc(diff / 1000 / 60);
		const sec = Math.trunc((diff / 1000)  % 60) ;

		return `Time: ${min}m, ${sec}s`;
	}
}
