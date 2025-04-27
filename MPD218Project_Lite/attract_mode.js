import * as Animations from '/configs/animations.js';
import { FX_PAD_A, FX_PAD_B } from '/configs/controller_encodings.js';


export function start() {
  twistKnobs();
  pressPads();
  colorSweep(".circle", "strokeColorSweep");
  colorSweep("button.pad", "borderColorSweep");
}

export function stop() {
  document.getAnimations()
    .filter(anim => ["svg", "circle", "button"].includes(anim.effect.target.localName))
    .forEach(anim => anim.cancel());
}

function twistKnobs() {
  const knobs = document.querySelectorAll(".knob");

  let animation;
  for (let i = knobs.length - 1; i >= 0; i--) {
    animation = knobs[i].animate(...Animations.knobTwist);
    animation.currentTime = i * 400;
  }
}

function colorSweep(selector, animation) {
  document.querySelectorAll(selector)
    .forEach(el => el.animate(...Animations[animation]));
}

function pressPad(delay) {
  const randNum = Math.floor(Math.random() * 16 + 1);
  const randPad = document.querySelector("#pad-" + randNum);
  const isModifier = (randNum === FX_PAD_A || randNum === FX_PAD_B);
 
  let bgColor = "rgba(0, 0, 255, 0.2)";
  if (randNum === FX_PAD_A) {
    bgColor = "#666";
  } else if (randNum === FX_PAD_B) {
    bgColor = "#444";
  }

  const animation = randPad.animate(...Animations.pressPad(bgColor, isModifier));
  delay ? animation.currentTime = (document.timeline.currentTime - delay) : 0;
  animation.onfinish = () => pressPad();
}

function pressPads() {
  pressPad(1000);
  pressPad(2000);
  pressPad(3000);
  pressPad(4000);
}
