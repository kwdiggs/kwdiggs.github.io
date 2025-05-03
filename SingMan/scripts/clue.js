import { foodList as FoodList } from  "./food-list.js";

const clueElement = document.getElementById("clue");
const clueIndex= getClueIndex();
const word = getWord().toUpperCase();
console.log(word);
let cluePlaceholder = setPlaceholder(word);
const updateCluePlaceholder = (() => clueElement.textContent = cluePlaceholder);

function getClueIndex() {
    let index = window.localStorage.getItem("clueIndex");

    if (index === null) {
        index = 0;
    } else {
        index++;
        index = index % FoodList.length;
    }

    window.localStorage.setItem("clueIndex", index);
    return index;
}

function getWord() {
    return FoodList[clueIndex];
}

function setPlaceholder(source) {
    let placeholder = Array(source.length + 1).fill().join("?");

    for (let i = 0; i < word.length; i++) {
        if (word[i] === " ") {
            placeholder = insertAt(placeholder, i, " ");
        }
    }

    return placeholder;
}

function insertAt(str, i, letter) {
    let temp = str.split("");
    temp[i] = letter;
    str = temp.join("");

    return str;
}

function assessGuess(letter) {
    let hasMatch = false;

    for (let i  = 0; i < word.length; i++) {
        if (letter === word[i]) {
            cluePlaceholder = insertAt(cluePlaceholder, i, letter);
            hasMatch = true;
        }
    }

    updateCluePlaceholder();
    return hasMatch;
}

function assessSolved() {
    for (let i = 0; i < cluePlaceholder.length; i++) {
        if (cluePlaceholder[i] === "?") {
            return false;
        }
    }

    return true;
}

updateCluePlaceholder();

export { assessGuess, assessSolved };
