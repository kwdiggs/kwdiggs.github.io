const message = document.getElementById("message");
let messageVisible = false;
message.style.visibility = Boolean(messageVisible) ? "visible" : "hidden";

function toggleMessage() {
    message.style.visibility = Boolean(messageVisible) ? "visible" : "hidden";
    messageVisible = !(messageVisible);
}

setTimeout(toggleMessage, 8500);
