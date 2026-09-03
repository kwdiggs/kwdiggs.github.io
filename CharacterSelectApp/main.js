const vowels = document.getElementsByClassName("letter");
const music = new Audio("./assets/fight_song_2.mp3");
const narrator = new Audio("./assets/choose_your_character.mp3");
music.loop = true;
const selectEffect = new Audio("./assets/select_fx.mp3");

const mute = document.getElementById("mute");
const muteIcon = document.getElementById("mute-icon");

let isUserActivated = false;
let isMusicPlaying = false;
let isFirstPlay = true;

mute.addEventListener("click", () => {
    if (isFirstPlay) {
        narrator.volume = 1;
        isFirstPlay = false;
    }

    music.volume = (isMusicPlaying) ? 0 : 1;
    muteIcon.src = (isMusicPlaying) ? "./assets/icons/volume-mute.png" : "./assets/icons/volume.png" ;
    isMusicPlaying = !isMusicPlaying;
});

document.addEventListener(("click"), () => {
     if (!isUserActivated) {
        isUserActivated = true;
        music.play();
        isMusicPlaying = true;
        if (isFirstPlay) {
            narrator.play();
            isFirstPlay = false;
        }
        muteIcon.src = "./assets/icons/volume.png";
    }
});

const onVowelClick = (event) =>  {
    for (let i = 0; i < vowels.length; i++) {
        if (event.target !== vowels[i]) {
            vowels[i].classList.remove("flashy-border");
        } else {
            vowels[i].classList.add("flashy-border");
            const platform = document.getElementById("platform");
            platform.innerText = vowels[i].innerText;
        }
    }

    if (isMusicPlaying) {
        (new Audio("./assets/select_fx.mp3")).play();
    }
};

for (let i = 0; i < vowels.length; i++) {
    vowels[i].addEventListener("click", onVowelClick);
}
