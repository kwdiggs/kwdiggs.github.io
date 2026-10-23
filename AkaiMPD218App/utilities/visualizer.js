let canvas;
let canvasCtx;
let analyser;
let bufferLen;
let dataArray;

export function buildVisualizer(analyserNode) {
  analyser = analyserNode;
  canvas = document.getElementById("visualizer");
  canvasCtx = canvas.getContext("2d");

  analyser.fftSize = 2048;
  bufferLen = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLen);
  analyser.getByteTimeDomainData(dataArray);
 
  canvas.classList.remove("display-none");
  canvas.classList.add("invisible");
  
  makeDraggable(canvas);  
  buildSwitch();

  draw();
}

//https:www.kirupa.com/html5/drag.htm# <- thanks for dragging logic, bro.
function makeDraggable(element) {
  let active = false;
  let initialX;
  let initialY;
  let currentX;
  let currentY;
  let xOffset = 0;
  let yOffset = 0;

  const container = document.querySelector("body");
  
  const dragStart = (e) => {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === element) {
      active = true;
    }
  };

  const drag = (e) => {
    if (!active) {
      return;
    }
    e.preventDefault();

    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    xOffset = currentX;
    yOffset = currentY;

    element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  const dragEnd = (e) => {
    initialX = currentX;
    initialY = currentY;

    active = false;
  };

  container.addEventListener("mousedown", dragStart, false);
  container.addEventListener("mousemove", drag, false);
  container.addEventListener("mouseup", dragEnd, false);
}

function buildSwitch() {
  const btn = document.createElement("button");
  const smile = "8-)";
  const agape = "8-O";
  
  btn.classList.add("visualizer-btn");
  btn.addEventListener("click", () => { 
    canvas.classList.contains("invisible")
      ? canvas.classList.remove("invisible")
      : canvas.classList.add("invisible");
  });

  btn.innerText = smile;
  btn.addEventListener("mousedown", (e) => e.currentTarget.innerText = agape);
  btn.addEventListener("mouseup", (e) => e.currentTarget.innerText = smile);

  document.querySelector("body").appendChild(btn);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
// ^^ I used this ^^
export function draw() {
  requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(255, 255, 255)";
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";
  canvasCtx.lineWidth = 1;

  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLen;
  let x = 0;

  for (let i = 0; i < bufferLen; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i == 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
