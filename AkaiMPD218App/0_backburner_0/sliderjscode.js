if (appMode == APP_MODE.Drums) {
  const svgs = Array.from(document.getElementsByClassName("fx-icon"));
  for (var i = 0; i < svgs.length; i++) {
    svgs[i].classList.remove("invisible");
  }
}

function performSwap(padIdA, padIdB) {
  const btnA = getPad(padIdA);
  const btnB = getPad(padIdB);
  
  if (btnA.classList.contains("flag")) {
    btnA.classList.remove("flag");
    btnB.classList.add("flag");
  } else if (btnB.classList.contains("flag")) {
    btnB.classList.remove("flag");
    btnA.classList.add("flag");
  }

  [btnA.textContent, btnB.textContent] = [btnB.textContent, btnA.textContent];
}

if (appMode == APP_MODE.SlidePuzzle) {
  document.addEventListener("board-swap", (e) => performSwap(e.detail[0] + 1, e.detail[1] + 1));
  document.addEventListener("puzzle-solved", (_) => attractMode(true));
  document.addEventListener("puzzle-unsolved", (_) => attractMode(false));
}

