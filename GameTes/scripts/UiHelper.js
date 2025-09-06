const startDialog = document.querySelector(".dialog");
const gameTable = document.querySelector(".game-table");
const cells = document.getElementsByClassName("game-cell");
const plusThreeColumn = document.querySelector(".plus-three-build");

const scoreboard = document.querySelector(".scoreboard");
const score = document.querySelector(".score");
const time = document.querySelector(".time");
const hintCount = document.querySelector(".hint-count");
const plusThreeCount = document.querySelector(".plus-three-count");

const refreshDialog = document.querySelector(".refresh-dialog");

function bootstrap(table) {
	buildTable(table);
	startAttractMode();
	cueStartupDialog(table);
}

function buildTable(table) {
	buildCells(table.TABLE_SIZE);
	makeUpcards(table.upcards);
}

function cueStartupDialog(table) {
	startDialog.addEventListener("click", () => {
		stopAttractMode();
		table.startTimer();
		startDialog.close();
		revealButtons();
	});
	startDialog.showModal();
}

function startAttractMode() {
	const keyframes = {
		transform: "rotateY(360deg)"
	};
	const options = {
		duration: 500,
		iterations: 2,
		direction: "alternate"
	};
	const indices = getShuffledCellIndices();

	const animateTwirls = () => {
		let delay = 1000;
		let animation;

		for (let index of indices) {
			options.delay = delay;
			delay += 2000;
			keyframes.transform = getRandomizedTransformation();
			animation = cells[index].animate(keyframes, options);
		}

		return animation;
	}

	const animation = animateTwirls();
	animation.onfinish = () => startAttractMode();
}

function stopAttractMode(animations) {
	document.getAnimations().forEach(a => a.cancel());
}

function getRandomizedTransformation() {
	const rand = Math.random();
	if (rand < 0.25) {
		return "rotateX(180deg)";
	} else if (rand < 0.5) {
		return "rotateX(-180deg)";
	} else if (rand < 0.75) {
		return "rotateY(180deg)";
	} else {
		return "rotateY(-180deg)"
	}
}

function getShuffledCellIndices() {
	const cellIndices = [];

	for (let i = 0; i < cells.length; i++) {
		cellIndices.push(i);
	}
	for (let i = cellIndices.length - 1; i >= 1; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cellIndices[i], cellIndices[j]] = [cellIndices[j], cellIndices[i]];
	}

	return cellIndices;
}

function revealButtons() {
	document.querySelector(".button-container").classList.remove("display-none");
}

function replaceUpcardContent(table) {
	table.upcards.forEach((card, i) => {
		const content = createContentNode(card);
		const oldChild = cells[i].children[0];
		cells[i].replaceChild(content, oldChild);
	});
}

function selectCard(index) {
	cells[index].classList.add("selected");
}

function deselectCard(index) {
	cells[index].classList.remove("selected");
}

function resetCardSelections() {
	for (let cell of cells) {
			cell.classList.remove("selected");
		}
}

function highlightUpcards(match) {
	if (match) {
		animateHint(match)
	} else {
		animateNotFound();
	}
}

function animateHint(matchIndices) {
	const keyframes = {
		background: "grey"
	};
	const options = {
		duration: 300,
		iterations: 2,
		direction: "reverse"
	};

	matchIndices.forEach(cardIndex => cells[cardIndex].animate(keyframes, options));
}

function animateNotFound() {
	const keyframes = {
		background: "rgba(255,0,33,0.5)"
	};
	const options = {
		duration: 300,
		iterations: 2,
		direction: "reverse"
	};

	for (let i = 0; i < cells.length; i++) {
		cells[i].animate(keyframes, options);
	}
}

function cueScoreboard(points, timeString, numHints, numPlusThree) {
	scoreboard.addEventListener("click", () => {
		scoreboard.close();
		cueRefreshDialog();
	});
	time.innerText = timeString;
	score.innerText = `Matches Found: ${points}`;
	hintCount.innerText = `Hints: ${numHints}`;
	plusThreeCount.innerText = `Plus Threes: ${numPlusThree}`;
	scoreboard.showModal();
	startAttractMode();
}

function cueRefreshDialog() {
	refreshDialog.addEventListener("click", () => window.location.reload());
	refreshDialog.showModal();
}

function buildCells(tableSize) {
	for (let i = 0; i < tableSize; i++) {
		const cell = createCellNode(i);
		gameTable.appendChild(cell);
	}
}

function makeUpcards(upcards) {
	upcards.forEach((card, i) => {
		const content = createContentNode(card);
		cells[i].appendChild(content);
	});
}

function createCellNode(index) {
	const cell = document.createElement("div");
	const eventDetail = { detail: { index } };
	const cardSelect = new CustomEvent('card-select', eventDetail);

	cell.classList.add("game-cell");
	cell.addEventListener('click', () => document.dispatchEvent(cardSelect));

	return cell;
}

function createContentNode(card) {
	const content = document.createElement("div");

	content.classList.add("cell-content");
	content.classList.add(getBorderClassName(card.border));
	content.classList.add(getRotationClassName(card.rotation));
	appendLetterNodes(content, card);

	return content;
}

function appendLetterNodes(content, card) {
	for (let i = 0; i < card.count; i++) {
			const letterNode = createLetterNode(card);
			content.appendChild(letterNode);
		}
}

function createLetterNode(card) {
	const letter = document.createElement("div");

	letter.classList.add("letter");
	letter.innerText = card.letter;

	return letter;
}

function getBorderClassName(border) {
	if (border === "Solid") {
		return "border-solid";
	} else if (border === "Dotted") {
		return "border-dotted";
	} else {
		return "border-none";
	}
}

function getRotationClassName(rotation) {
	if (rotation === "Positive") {
		return "rotate-positive";
	} else if (rotation === "Negative") {
		return "rotate-negative";
	} else {
		return "rotate-zero";
	}
}

function animateMatchDiscard(selections) {
	const keyframes = {
		transform: "translateX(-1100px) translateY(-1300px) rotate(180deg)"
	};
	const options = {
		duration: 400,
		iterations: 1,
		transitionTimingFunction: "linear",
	};

	const animations = selections.map((s, i) => 	cells[s].animate(keyframes, options));

	return animations;
}

function animateInvalidMatch() {
	highlightUpcards(false);
}

function activateUpcardBuild(table) {
	for (let i = 0; i < 3; i++) {
		const cell = createCellNode(i + 12);
		plusThreeColumn.appendChild(cell);
		const content = createContentNode(table.upcards[i + 12])
		cell.append(content);
	}
	plusThreeColumn.classList.remove("display-none");
}

function deactivateUpcardBuild() {
	plusThreeColumn.textContent = "";
	plusThreeColumn.classList.add("display-none");
}

export {
	bootstrap,
	buildTable,
	cueStartupDialog,
	replaceUpcardContent,
	selectCard,
	deselectCard,
	resetCardSelections,
	highlightUpcards,
	animateMatchDiscard,
	animateInvalidMatch,
	cueScoreboard,
	activateUpcardBuild,
	deactivateUpcardBuild,
};
