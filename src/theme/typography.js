// src/theme/typography.js
// Minimal overrides on top of MUI default Roboto.

const typography = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: { fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em" },
  h2: { fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em" },
  h3: { fontSize: 20, fontWeight: 600 },
  h4: { fontSize: 18, fontWeight: 600 },
  body1: { fontSize: 14, fontWeight: 400 },
  body2: { fontSize: 13, fontWeight: 400 },
  caption: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  button: { textTransform: "none", fontWeight: 600 },
};

export default typography;
