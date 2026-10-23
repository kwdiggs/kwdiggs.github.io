/* 
 Example Midi Event Data:
 [153, 45, 64] = [On, Note Id (45), Velocity (64)]
 [137, 45, 0] = [Off, Note Id (45), Velocity (0)] 
 [217, 80] = [Velocity Changed, Velocity (80)]
 [176, 13, 2] = [Knob Change, KnobId (13), Value 0-127 (2)]
*/

export const COMMAND_CODES = {
  NoteOn: 153,
  NoteOff: 137,
  VelocityChange: 217,  
  KnobChange: 176,
}

export const KNOB_ENCODING = {
  3: 1,
  9: 2,
  12: 3,
  13: 4,
  14: 5,
  15: 6,
}

export const KNOB_NAME = [
  "Lowpass",
  "Highpass",
  "Panning",
  "Ping Pong",
  "Dead Knob",
  "Gain",
]

export const PAD_ENCODING = {
  1: 13,
  2: 14,
  3: 15,
  4: 16,
  5: 9,
  6: 10,
  7: 11,
  8: 12,
  9: 5,
  10: 6,
  11: 7,
  12: 8,
  13: 1,
  14: 2,
  15: 3,
  16: 4
}

export const KEYBOARD_ENCODING = {
  '7': 1,
  '8': 2,
  '9': 3,
  '0': 4,
  'u': 5,
  'i': 6,
  'o': 7,
  'p': 8,
  'j': 9,
  'k': 10,
  'l': 11,
  ';': 12,
  'm': 13,
  ',': 14,
  '.': 15,
  '/': 16,
}

export const LPASS = 1;
export const HPASS = 2;
export const PANNING = 3;
export const STDELAY = 4;
export const SWELL = 5;
export const GAIN = 6;

export const FX_PAD_A = 15;
export const FX_PAD_B = 16;

export const MaxVelocity = 127;
