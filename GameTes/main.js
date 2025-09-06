import { PlayingCard } from './scripts/PlayingCard.js';
import { Table } from './scripts/Table.js';
import * as Ui from './sripts/UiHelper.js'


const hintBtn = document.querySelector(".hint");
const plusThreeBtn = document.querySelector(".plus-three");

const gameState = {
	selections: [],
	upcardBuildActive: false,
	gameOver: false,
	hintCount: 0,
	plusThreeCount: 0
};
const table = new Table();

function bootstrap() {
	initializeActionButtons();
	console.log('f');
	Ui.bootstrap(table);
	respondToCardClicks();
}

function initializeActionButtons() {
	const showHint = () => {
		gameState.hintCount++;
		Ui.highlightUpcards(table.findMatch());
	}
	const plusThreeBuild = () => {
		gameState.plusThreeCount++;
		activateUpcardBuild();
	}

	hintBtn.addEventListener("click", showHint);
	plusThreeBtn.addEventListener("click", plusThreeBuild);
}

function respondToCardClicks() {
	const cardSelect = (e) => {
		if (gameState.gameOver || table.upcards[e.detail.index].letter === " ") {
			return;
		}
		processSelection(e.detail.index);
	}

	document.addEventListener('card-select', cardSelect);
}

function processSelection(index) {
	updateSelectionState(index);

	if (gameState.selections.length === 3) {
		processMatch();
	}
}

function updateSelectionState(index) {
	const alreadySelected = gameState.selections.includes(index);
	const select = (i) => {
		gameState.selections.push(i);
		Ui.selectCard(i);
	};
	const deselect = (i) => {
		Ui.deselectCard(i);
		gameState.selections = gameState.selections.filter(s => s != i);
	};

	!(alreadySelected) ? select(index) : deselect(index);
}

function processMatch() {
	const matchValid = table.matchValid(gameState.selections);
	if (!matchValid) {
		resetSelections();
		return;
	}

	makeMatch();
	resetSelections();
	calcGameOverStatus();
}

function makeMatch() {
	const validMatch = table.matchValid(gameState.selections);

	if (!validMatch) {
		Ui.animateInvalidMatch();
	}

	if (validMatch && !gameState.upcardBuildActive) {
		Ui.animateMatchDiscard(gameState.selections);
		table.performMatch(gameState.selections);
		Ui.replaceUpcardContent(table);
	}

	if (validMatch && gameState.upcardBuildActive) {
		const animations = Ui.animateMatchDiscard(gameState.selections);
		table.performMatchNoRestock(gameState.selections);
		animations[0].onfinish = () => {
			deactivateUpcardBuild();
			Ui.replaceUpcardContent(table);
		}
	}

	return validMatch;
}

function calcGameOverStatus() {
	gameState.gameOver = table.deckEmpty && !table.matchExists;

	if (gameState.gameOver) {
		plusThreeBtn.classList.add("display-none");
		hintBtn.classList.add("display-none");
		Ui.cueScoreboard(
			table.score,
			table.calcTime(),
			gameState.hintCount,
			gameState.plusThreeCount
		);
	} else if (table.deckEmpty) {
		plusThreeBtn.classList.add("display-none");
	}

	return gameState.gameOver;
}

function resetSelections() {
		Ui.resetCardSelections();
		gameState.selections = [];
}

function activateUpcardBuild() {
	if (table.deckEmpty || gameState.upcardBuildActive) {
		return;
	}
	gameState.upcardBuildActive = true;
	plusThreeBtn.classList.add("display-none");
	table.activateUpcardBuild();
	Ui.activateUpcardBuild(table);
}

function deactivateUpcardBuild() {
	table.condenseUpcards();
	Ui.deactivateUpcardBuild();
	plusThreeBtn.classList.remove("display-none");
	gameState.upcardBuildActive = false;
}

bootstrap();
// Soli Deo Gloria
