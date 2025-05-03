const dialog = document.querySelector("dialog");
const closeButton = document.getElementById("dialog-close-button");
const newgameButton = document.getElementById("new-game");
const refreshButton = document.getElementById("refresh-button");
const finalMessage = document.getElementById("final-message");

const closeDialogFn = (() => dialog.close());
const refreshPageFn = (() => window.location.reload());

closeButton.addEventListener("click", closeDialogFn);
newgameButton.addEventListener("click", refreshPageFn);
refreshButton.addEventListener("click", refreshPageFn);

function showEndingModal(solved) {
    const dialog = document.getElementById("ending-modal");
    const message = document.getElementById("final-message");
    const backgroundUrl = Boolean(solved)
        ? "./assets/victory.png"
        : "./assets/defeat.png";

    dialog.style.backgroundImage= "url(" + backgroundUrl  + ")";
    message.innerText = Boolean(solved)
        ? "You Win!"
        : "Game Over! Try Again.";

    dialog.showModal();
}

export { dialog, showEndingModal };
