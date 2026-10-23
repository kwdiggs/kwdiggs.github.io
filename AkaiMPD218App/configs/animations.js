/*
 * [ keyframes, options ]
 */
export const toast = [
  {
    display: "block",
    opacity: [1, 0],
  },
  {
    duration: 2500,
    easing: "ease-in",
    iterations: 1,
  }
]

export const activeKnob = [
  {
    border: ["1px solid white", "1px solid white"],
  },
  {
    duration: 500,
    iterations: 1,
  }
]

export const knobTwist = [
  [
    { transform: "rotate(0)" },
    { transform: "rotate(125deg)", offset: 0.2 },
    { transform: "rotate(180deg)", offset: 0.75 },
    { transform: "rotate(0)" },
  ],
  {
    duration: 3000,
    iterations: Infinity,
  }
]

export const activePad = [
  {
    borderColor: ["red", "red"],
    backgroundColor: ["rgba(0, 0, 255, 0.2)", "rgba(0, 0, 255, 0.2)"],
    transform: ["scale(0.99)", "scale(1.03)"],
  },
  {
    duration: 55,
    direction: "alternate",
    iterations: Infinity,
  }
]

export const activePadMod = (bgColor) => [
  {
    borderColor: ["green", "green"],
    backgroundColor: [bgColor, bgColor],
    transform: ["scale(0.99)", "scale(1.03)"],
  },
  {
    duration: 55,
    direction: "alternate",
    iterations: Infinity,
  }
]

export const pressPad = (bgColor, isModifier) => [
  {
    background: [bgColor, bgColor],
    transform: isModifier ? ["scale(0.99)", "scale(1.03)"] : "none",
  },
  {
    duration: 55,
    iterations: 60,
  }
]

export const strokeColorSweep = [
  {
    stroke: ["pink", "purple", "green", "orange", "green", "purple", "pink"],
  },
  {
    duration: 2000,
    iterations: Infinity,
  }
]

export const borderColorSweep = [
  {
    borderColor:  ["pink", "purple", "green", "orange", "green", "purple", "pink"],
  },
  {
    duration: 2000,
    iterations: Infinity,
  }
]
