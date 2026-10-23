const ROW_LENGTH = 4;
let board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, -1];
let flag_pos = 15;

function swappable(pos) {
  if (pos < 0 || pos > board.length) {
    return false;
  }

  let plusOrMinusOne = Boolean(Math.abs(pos - flag_pos) == 1);
  let lastInRow = (index) => Boolean((index + 1) % ROW_LENGTH == 0);
  let rowOverflow = Boolean(
        (lastInRow(pos) && pos < flag_pos)
        || (lastInRow(pos) && pos < flag_pos)
  );
  let orthogonalX = plusOrMinusOne && !rowOverflow;
  let orthogonalY = Math.abs(pos - flag_pos) == ROW_LENGTH;
  
  if (!(orthogonalY || orthogonalX)) {
    return false;
  }

  return true;
}

function puzzleSolved() {
  let misordered = board.slice(0, board.length - 1).find((element, index) => element != index + 1);
  let flagCorrect = board[board.length - 1] == -1;
  return Boolean(!misordered && flagCorrect);
}

function swap(pos) {
  [ board[pos], board[flag_pos] ] = [ board[flag_pos], board[pos] ];
  let event = new CustomEvent("board-swap", { detail: [pos, flag_pos] });
  document.dispatchEvent(event);
  flag_pos = pos;
}

function processUserMove(pos) {
  if (swappable(pos - 1)) {
    if (puzzleSolved()) { // leaving solved state
      document.dispatchEvent(new Event("puzzle-unsolved"));
    } 
    swap(pos - 1);
    if (puzzleSolved()) { // has entered solved state
      document.dispatchEvent(new Event("puzzle-solved"));
    }
  }
}

function initPuzzle() {
  if (appMode != APP_MODE.SlidePuzzle) {
    return;
  }

  document.addEventListener("note-change", (e) => {
      if (e.detail.isOn) {
        processUserMove(e.detail.padNum);
      }
  });
}

initPuzzle();
