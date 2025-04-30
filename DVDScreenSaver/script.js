const message = document.getElementById("message");
let messageVisible = false;

function toggleMessage() {
    message.style.visibility = Boolean(messageVisible) ? "visible" : "hidden";
    messageVisible = !(messageVisible);
}

toggleMessage();
setTimeout(toggleMessage, 7000);
setTimeout(toggleMessage, 10000);
