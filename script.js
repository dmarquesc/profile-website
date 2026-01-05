/**
 * ============================================================
 * MORPHING TEXT EFFECT (SVG FILTER BASED)
 * ------------------------------------------------------------
 * This script creates a "gooey" morphing text animation by:
 * 1. Layering two text elements (#text1 and #text2)
 * 2. Alternating their blur + opacity
 * 3. Passing both through an SVG threshold filter
 *
 * Originally adapted from a CodePen experiment and
 * refactored for:
 * - Accessibility
 * - GitHub Pages stability
 * - Educational clarity
 * - Future extensibility
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
  ELEMENT REFERENCES
  ============================================================ */
  const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2"),
  };

  // Defensive check
  if (!elts.text1 || !elts.text2) {
    console.warn("Morphing text elements not found in DOM.");
    return;
  }

  /* ============================================================
  CONTENT CONFIGURATION
  ============================================================ */
  const texts = [
    "Be",
    "at",
    "Peace",
    "with",
    "all",
    "men",
  ];

  /* ============================================================
  TIMING CONFIGURATION (seconds)
  ============================================================ */
  const morphTime = 1;
  const cooldownTime = 0.25;

  /* ============================================================
  STATE VARIABLES
  ============================================================ */
  let textIndex = texts.length - 1;
  let lastTime = performance.now();
  let morph = 0;
  let cooldown = cooldownTime;

  /* ============================================================
  INITIAL TEXT SETUP
  ============================================================ */
  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];

  /* ============================================================
  ACCESSIBILITY: REDUCED MOTION
  ============================================================ */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    elts.text1.textContent = texts[0];
    elts.text2.textContent = "";
    elts.text1.style.filter = "none";
    elts.text1.style.opacity = "100%";
    elts.text2.style.opacity = "0%";
    return;
  }

  /* ============================================================
  MORPHING LOGIC
  ============================================================ */
  function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
      fraction = 1;
    }

    setMorph(fraction);
  }

  function setMorph(fraction) {
    // Text 2 fades IN
    elts.text2.style.filter = `blur(${Math.min(
      8 / fraction - 8,
      100
    )}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    // Text 1 fades OUT
    const inverse = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(
      8 / inverse - 8,
      100
    )}px)`;
    elts.text1.style.opacity = `${Math.pow(inverse, 0.4) * 100}%`;

    // Update content
    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent =
      texts[(textIndex + 1) % texts.length];
  }

  function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "none";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "none";
    elts.text1.style.opacity = "0%";
  }

  /* ============================================================
  ANIMATION LOOP (FIXED INDEX LOGIC)
  ============================================================ */
  function animate(now) {
    requestAnimationFrame(animate);

    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    cooldown -= deltaTime;

    if (cooldown <= 0) {
      doMorph();

      // ✅ Advance text ONLY when morph completes
      if (morph >= morphTime) {
        morph = 0;
        cooldown = cooldownTime;
        textIndex++;
      }
    } else {
      doCooldown();
    }

    morph += deltaTime;
  }

  /* ============================================================
  START ANIMATION
  ============================================================ */
  requestAnimationFrame(animate);
});

