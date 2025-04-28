import * as Animations from './configs/animations.js';
import * as SvgBuilder from './utilities/svg_builder.js';
import * as AttractMode from './attract_mode.js';
import { EventName } from './configs/custom_events.js';
import { FX_PAD_A, FX_PAD_B, KNOB_NAME } from './configs/controller_encodings.js';


let midiDeviceUserActivated = false;
let activeButtons = Array(16).fill(false);

function init() {
  populateDom();
  registerEventListeners();
  AttractMode.start();
}

function populateDom() {
  buildMuter();
  buildKnobs(6);
  buildPads(16);
  buildDynamicLabel();
}

function buildMuter() {
  const muteWrap = document.querySelector(".mute-icon");
  const mute = SvgBuilder.buildMuter();
  muteWrap.appendChild(mute);
}

function buildKnobs(quantity) {
  const knobCont = document.querySelector(".knob-container");

  for (var i = 1; i <= quantity; i++) {
    const knob = SvgBuilder.buildKnob(i);
    knobCont.appendChild(knob); 
  }
}

function buildPads(quantity) {
  buildButtons(quantity);

  const fxIcons = [
    SvgBuilder.buildFxIcon("#e82"),
    SvgBuilder.buildFxIcon("#2ff"),
  ];

  const svgBtnMap = fxIcons.map((fxIcon, i) => {
    return { 
      svg: fxIcon,
      button: document.querySelector("#pad-" + Number(i+15)) ,
    }
  });

  svgBtnMap.forEach(sb => sb.button.appendChild(sb.svg));
}

function buildButtons(quantity) {
  const container = document.querySelector(".pad-container");

  for (let i = 1; i <= quantity; i++) {
    const button = document.createElement("button");
    button.classList.add("pad");
    button.setAttribute("id", "pad-" + i);
    container.appendChild(button);

    const padOn = new CustomEvent(EventName.PadChange, {
        detail: {
          padId: i,
          isOn: true,
          velocity: 127,
        }
    });

    const padOff = new CustomEvent(EventName.PadChange, {
      detail: {
        padId: i,
        isOn: false,
        velocity: 0,
      }
    });

    const turnOn = function() {
      activeButtons[i - 1] = true;
      document.dispatchEvent(padOn);
    };

    const turnOff = function() {
      if (!activeButtons[i - 1]) {
        return;
      }
      document.dispatchEvent(padOff);
      activeButtons[i - 1] = false;
    };

    button.addEventListener("pointerdown", turnOn);
    button.addEventListener("pointerup", turnOff);
    button.addEventListener("pointerleave", turnOff);
  }
}

function buildDynamicLabel() {
  const knobCont = document.querySelector(".knob-container");
  const div = document.createElement("div");
  div.classList.add("dynamic-label");
  knobCont.appendChild(div);
}

function registerEventListeners() {
  const activateMidiDevice = () => {
    if (!midiDeviceUserActivated) { 
      midiDeviceUserActivated = true;
      AttractMode.stop();
    }
  };

  const mute = document.querySelector(".mute-icon");
  mute.addEventListener("click", function firstClick(e) {
    e.currentTarget.removeEventListener(e.type, firstClick);
    mute.classList.add("display-none");

    const userActivated = new Event(EventName.UserActivated);
    document.dispatchEvent(userActivated);
  });

  document.addEventListener(EventName.KnobChange, (e) => {
    activateMidiDevice();
    onKnobActivated(e.detail.knobId, e.detail.vel);
  });

  document.addEventListener(EventName.PadChange, (e) => {
    activateMidiDevice();
    e.detail.isOn ? onPadActivated(e.detail.padId) : onPadDeactivated(e.detail.padId);
  });

  document.addEventListener(EventName.KnobLabelChange, (e) => {
    updateDynamicLabel(e.detail.knobId, e.detail.stringValue);  
  });

  document.addEventListener(EventName.MidiStateChange, (e) => {
    toast(`${e.detail.mfr} ${e.detail.name}: ${e.detail.state}`);
  });
}

function onPadActivated(padId) {
  const button = document.querySelector("#pad-" + padId);
  let animation;

  if (padId === FX_PAD_A) {
    animation = button.animate(...Animations.activePadMod("#444"));
  } else if (padId === FX_PAD_B) {
    animation = button.animate(...Animations.activePadMod("#666"));
  } else {
    animation = button.animate(...Animations.activePad);
  }
  animation.id = "Pad" + padId;
}

function onPadDeactivated(padId) {
  document.getAnimations()
    .find(a => a.id === "Pad" + padId)
    .cancel();
}

function onKnobActivated(knobId, vel) {
  const knob = document.querySelector(".knob-" + knobId);
  knob.style.transform = `rotate(${Math.ceil(vel * 1.41)}deg)`;
}

function toast(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.animate(...Animations.toast);
}

function updateDynamicLabel(knobId, value) {
  const knob = document.querySelector(".knob-" + knobId);
  const dynamicLabel = document.querySelector(".dynamic-label");
  dynamicLabel.textContent = KNOB_NAME[knobId - 1] + ": " + value;
  
  const knobAnim = knob.animate(...Animations.activeKnob);
  knobAnim.id = "Knob" + knobId;
}

init();
