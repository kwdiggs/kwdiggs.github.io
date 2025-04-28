import {
  COMMAND_CODES,
  KNOB_ENCODING,
  PAD_ENCODING,
  KEYBOARD_ENCODING
} from '../configs/controller_encodings.js';
import { EventName } from '../configs/custom_events.js';


let siteUserActivated = false;

function initMidi() {
  navigator.requestMIDIAccess({ sysex: false, software: false }).then(
    (access) => useAccess(access),
    (error) => console.error
  );

  const activate = (() => {
    siteUserActivated = true;
    handleKeydownAndKeyup();
  });
  const options = { once: true };
  document.addEventListener(EventName.UserActivated, activate, options);
};

function useAccess(access) {
  access.onstatechange = (change) => handleConnectionEvent(change);

  access.inputs.forEach(input => {
    if (input.manufacturer === "Akai") {
      input.onmidimessage = handleMidiMessage;
    }
  });
}

function handleKeydownAndKeyup() {
  document.addEventListener("keydown", (e) =>  {
    if (e.repeat) {
      return;
    }

    if (!KEYBOARD_ENCODING.hasOwnProperty(e.key)) {
      return;
    }

    document.dispatchEvent(new CustomEvent(EventName.PadChange, {
      detail: {
        padId: KEYBOARD_ENCODING[e.key],
        isOn: true,
        velocity: 127,
      }
    }));
  });

  document.addEventListener("keyup", (e) =>  {
    if (!KEYBOARD_ENCODING.hasOwnProperty(e.key)) {
      return;
    }

    document.dispatchEvent(new CustomEvent(EventName.PadChange, {
        detail: {
          padId: KEYBOARD_ENCODING[e.key],
          isOn: false,
          velocity: 0,
        }
      }));
  });
}

function handleConnectionEvent(e) {
  const { manufacturer, name, state } = e.port;
  const midiInputs = e.target.inputs;

  if (manufacturer !== "Akai") {
    return;
  }

  if (state === "connected") {
    midiInputs.forEach(midiInput => midiInput.onmidimessage = handleMidiMessage);
  }

  const stateChange = new CustomEvent(EventName.MidiStateChange, {
    detail: {
      mfr: manufacturer,
      name: name,
      state: state.toUpperCase(),
    }
  });

  document.dispatchEvent(stateChange);
}

function handleMidiMessage(event) {
  if (!siteUserActivated) {
    return;
  }

  let command = event.data[0];
  let note = event.data[1];
  let velocity = event.data[2];
  let padId = PAD_ENCODING[note - 35];

  switch(command) {
    case COMMAND_CODES.NoteOn:
      onPadChange(padId, true, velocity);
      break;
    case COMMAND_CODES.NoteOff:
      onPadChange(padId, false);
      break;
    case COMMAND_CODES.KnobChange:
      onKnobChange(note, velocity);
      break;
  }
}

function onKnobChange(knobId, velocity) {
  let e = new CustomEvent(EventName.KnobChange, {
    detail: {
      knobId: KNOB_ENCODING[knobId],
      vel: velocity,
    }
  });

  document.dispatchEvent(e);
}

function onPadChange(id, isOn, velocity) {
  let e = new CustomEvent(EventName.PadChange, {
    detail: {
      padId: id,
      isOn: isOn,
      velocity: velocity,
    }
  });

  document.dispatchEvent(e);
}

initMidi();
