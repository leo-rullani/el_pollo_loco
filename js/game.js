// game.js

let canvas; 
let world; 
let keyboard = new Keyboard();

// Flags for muting audio
let musicMuted = false;
let soundEffectsMuted = false;

// Audio for button clicks (only plays when toggling ON)
let buttonClickSound = new Audio('audio/button-click.mp3');
buttonClickSound.volume = 1.0; // Adjust volume if you like

function init() {
  console.log("Init called");
}

/** 
 * Start the game from the menu.
 */
function startGame() {
  document.getElementById('overlay-menu').classList.add('hidden');
  document.getElementById('canvas').style.display = 'block';

  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  canvas = document.getElementById("canvas");
  let level = createLevel1();
  world = new World(canvas, keyboard, level);

  console.log("Game started, character is", world.character);
}

/** 
 * Restart game after Win or Game Over
 */
function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  document.getElementById('canvas').style.display = 'block';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  canvas = document.getElementById("canvas");
  let level = createLevel1();
  world = new World(canvas, keyboard, level);

  console.log("Restarted game, character is", world.character);
}

/** 
 * Return to Menu from overlays
 */
function goToMenu() {
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  document.getElementById('canvas').style.display = 'none';

  let title = document.querySelector('h1');
  if (title) title.style.display = 'none';

  document.getElementById('overlay-menu').classList.remove('hidden');
  console.log("Back to menu");
}

/** 
 * Open Settings overlay
 */
function openSettings() {
  document.getElementById('overlay-settings').classList.remove('hidden');
}

/** 
 * Close Settings overlay (no audio on close)
 */
function closeSettings() {
  document.getElementById('overlay-settings').classList.add('hidden');
}

/** 
 * Open Help overlay
 */
function openHelp() {
  document.getElementById('overlay-help').classList.remove('hidden');
}

/** 
 * Close Help overlay
 */
function closeHelp() {
  document.getElementById('overlay-help').classList.add('hidden');
}

/** 
 * Open Impressum overlay
 */
function openImpressum() {
  document.getElementById('overlay-impressum').classList.remove('hidden');
}

/** 
 * Close Impressum overlay
 */
function closeImpressum() {
  document.getElementById('overlay-impressum').classList.add('hidden');
}

/** 
 * Toggle background music.
 * If turning OFF, no click sound.
 * If turning ON, play click sound.
 */
function toggleMusic() {
  let musicIcon = document.getElementById('music-icon');
  if (!musicMuted) {
    // Currently ON, turning OFF
    musicMuted = true;
    musicIcon.classList.add('muted');
    console.log("Music muted.");
  } else {
    // Currently OFF, turning ON
    musicMuted = false;
    musicIcon.classList.remove('muted');
    console.log("Music unmuted.");
    playButtonClick(); // only on turning ON
  }
  // TODO: actually mute/unmute your in-game music if you have it
}

/** 
 * Toggle sound effects.
 * If turning OFF, no click sound.
 * If turning ON, play click sound.
 */
function toggleSoundEffects() {
  let sfxIcon = document.getElementById('sfx-icon');
  if (!soundEffectsMuted) {
    // Currently ON, turning OFF
    soundEffectsMuted = true;
    sfxIcon.classList.add('muted');
    console.log("Sound effects muted.");
  } else {
    // Currently OFF, turning ON
    soundEffectsMuted = false;
    sfxIcon.classList.remove('muted');
    console.log("Sound effects unmuted.");
    playButtonClick(); // only on turning ON
  }
  // TODO: actually mute/unmute your in-game SFX if you have them
}

/** 
 * Plays short button click sound (only used when toggling ON).
 */
function playButtonClick() {
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
}

/** 
 * Key events (unchanged)
 */
window.addEventListener("keydown", (e) => {
  console.log("Key pressed: ", e.keyCode, e.key);
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});