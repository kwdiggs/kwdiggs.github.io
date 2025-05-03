const curtain = document.getElementById("curtain");
let curtainHeight = 65;
curtain.style.height = curtainHeight + "vh";

function liftCurtainStep() {
    curtainHeight = curtainHeight - 8;
    curtain.style.height = curtainHeight + "vh";
}

export { liftCurtainStep };
