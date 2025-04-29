const vowels = document.getElementsByClassName("letter");

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
};

for (let i = 0; i < vowels.length; i++) {
    vowels[i].addEventListener("click", onVowelClick);
}
