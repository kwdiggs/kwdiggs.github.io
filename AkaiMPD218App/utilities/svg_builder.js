const nsUri = "http://www.w3.org/2000/svg";
const svgName = "svg";
const mkElement = (elem) => document.createElementNS(nsUri, elem);
const setAttributes = (host, at) => Object.keys(at).forEach(key => host.setAttribute(key, at[key]));


export function buildMuter() {
  const mute = mkElement(svgName);
  const cir = mkElement("circle");
  const poly = mkElement("polygon");
  const rect = mkElement("rect");
  const path = mkElement("path");
  
  const cirAttributes = {
    "cx": "23",
    "cy": "20",
    "r": "9",
    "stroke": "red",
    "stroke-width": "1",
  };
  const polyAttributes = {
    "points": "20, 20 25, 15 25, 25",
    "fill": "blue",
    "stroke": "blue",
    "stroke-width": "1",
  };
  const rectAttributes = {
    "x": "19",
    "y": "18",
    "width": "3",
    "height": "4",
    "fill": "blue",
    "stroke": "blue",
    "stroke-width": "1",
  };
  const pathAttributes = {
    "d": "M 17, 14 L 29,26",
    "stroke": "red",
    "stroke-width": "1",
    "stroke-linecap": "round",
  };

  mute.setAttribute("viewBox", "12 9 21 21");
  setAttributes(cir, cirAttributes);
  setAttributes(poly, polyAttributes);
  setAttributes(rect, rectAttributes);
  setAttributes(path, pathAttributes);

  mute.appendChild(cir);
  mute.appendChild(poly)
  mute.appendChild(rect);
  mute.appendChild(path);

  return mute;
}

export function buildKnob(index) {
  const knob = mkElement(svgName);
  const cir = mkElement("circle")
  const needle = mkElement("path"); 

  const cirAttributes = {
    "cx": "45",
    "cy": "45",
    "r": "35",
    "stroke": "blue",
    "stroke-width": "2",
    "fill": "none"
  };
  const needleAttributes = {
    "d": "M 45 45 L 25 45",
    "stroke": "#FF0000",
    "stroke-linecap": "round",
    "stroke-width": "4"
  };

  knob.setAttribute("viewBox", "0 0 90 90");
  setAttributes(needle, needleAttributes);
  setAttributes(cir, cirAttributes);
  
  knob.classList.add("knob", "knob-" + index);
  cir.classList.add("circle");
  
  knob.appendChild(cir);
  knob.appendChild(needle);

  return knob;
}

export function buildFxIcon(color) {
  const fxIcon = mkElement(svgName);
  const shaft = mkElement('rect');
  const node = mkElement('rect')
  const arrowhead = mkElement('path');
  const text = mkElement('text');

  const shaftAttributes = {
    "x": "-53",
    "y": "-75",
    "width": "63",
    "height": "10",
    "fill": "#000",
    "stroke": color,
    "stroke-width": "2",
  };
  const nodeAttributes = {
    "x": "-42",
    "y": "-80",
    "width": "43",
    "height": "20",
    "fill": color,
    "stroke": color,
    "stroke-width": "2", 
  };
  const arrowheadAttributes = {
    "d": "M 8 -74 L 8 -79 L 20 -70 L 8 -61 L 8 -66",
    "fill": "#000",
    "stroke": color,
    "stroke-width": "2"
  };
  const textAttributes = {
    "x": "-27",
    "y": "-65",
  };

  fxIcon.setAttribute("viewBox", "-60 -105 85 70");
  setAttributes(shaft, shaftAttributes);
  setAttributes(node, nodeAttributes);
  setAttributes(arrowhead, arrowheadAttributes);
  setAttributes(text, textAttributes);

  fxIcon.classList.add("fx-icon");
  text.classList.add("fx-icon-label");
  text.textContent = "Fx";

  fxIcon.appendChild(shaft);
  fxIcon.appendChild(node);
  fxIcon.appendChild(arrowhead);
  fxIcon.appendChild(text);

  return fxIcon;
}
