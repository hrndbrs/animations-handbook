// docs/text/typing-scramble.js
// Two independent demos. The typewriter effect never splits the DOM — it
// just grows a single text node's content over time via rAF, timed by
// elapsed milliseconds rather than frame count (so speed is consistent
// regardless of display refresh rate). The scramble effect DOES need
// split-text.js, since each character has to independently randomize
// before resolving.

import { splitText } from '../../utils/split-text.js';

const TYPING_TEXT = 'Every frame moves this forward.';
const MS_PER_CHAR = 60;

const typingTarget = document.getElementById('typing-target');
const typingTrigger = document.getElementById('typing-trigger');

function runTyping() {
  typingTrigger.disabled = true;
  let charIndex = 0;
  let lastTime = null;

  function step(timestamp) {
    if (lastTime === null) {
      lastTime = timestamp;
    }
    const elapsed = timestamp - lastTime;
    if (elapsed >= MS_PER_CHAR) {
      charIndex += 1;
      lastTime = timestamp;
      typingTarget.textContent = TYPING_TEXT.slice(0, charIndex);
    }
    if (charIndex < TYPING_TEXT.length) {
      requestAnimationFrame(step);
    } else {
      typingTrigger.disabled = false;
    }
  }

  typingTarget.textContent = '';
  requestAnimationFrame(step);
}

typingTrigger.addEventListener('click', runTyping);
runTyping();

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

const scrambleTarget = document.getElementById('scramble-target');
const scrambleTrigger = document.getElementById('scramble-trigger');

function runScramble() {
  const pieces = splitText(scrambleTarget, { by: 'char' });
  pieces.forEach((piece, index) => {
    const finalChar = piece.textContent;
    const resolveAt = 300 + index * 40;
    let elapsed = 0;
    let lastTime = null;

    function frame(timestamp) {
      if (lastTime === null) {
        lastTime = timestamp;
      }
      elapsed += timestamp - lastTime;
      lastTime = timestamp;
      if (elapsed >= resolveAt) {
        piece.textContent = finalChar;
        return;
      }
      piece.textContent = randomChar();
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  });
}

scrambleTrigger.addEventListener('click', runScramble);
runScramble();
