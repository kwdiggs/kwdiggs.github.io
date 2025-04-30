const message = document.getElementById("message");
let messageVisible = false;

function toggleMessage() {
    message.style.visibility = Boolean(messageVisible) ? "visible" : "hidden";
    messageVisible = !(messageVisible);
}

toggleMessage();
setTimeout(toggleMessage, 8500);
setTimeout(toggleMessage, 14000);
