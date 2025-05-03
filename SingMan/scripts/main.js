import { dialog as Dialog, showEndingModal } from "./dialog.js";
import { assessGuess, assessSolved } from "./clue.js";
import { liftCurtainStep } from "./curtain.js";

const maxGuesses = 8;
const prevGuesses = [];

let gameOver = false;
let solved = false;
let wrongGuesses = 0;

function processGuess(letter) {
    prevGuesses.push(letter);
    const matched = assessGuess(letter);
    solved = assessSolved();

    if(solved) {
        gameOver = true;
        showEndingModal(true);
        return;
    }

    if (!matched) {
        processWrongGuess();
    }
}

function processWrongGuess() {
    wrongGuesses++;
    liftCurtainStep();

    if (wrongGuesses > maxGuesses) {
        showEndingModal(false);
        gameOver = true;
    }
}

const letters = document.getElementsByClassName("letter");

const onLetterClick = (e) => {
    if (gameOver) {
        return;
    }

    const guess = e.target.innerText;
    const duplicateGuess = prevGuesses.includes(guess);

    if (duplicateGuess) {
        return;
    }

    processGuess(guess);
    e.target.classList.add("spent-guess");
};

for (let l of letters) {
     l.addEventListener("click", onLetterClick);
}



