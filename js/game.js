// game.js

let canvas;
let world;
let keyboard = new Keyboard();

// Flags for muting audio
let musicMuted = false;
let soundEffectsMuted = false;

// Audio for button clicks (only plays when turning ON)
let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0; // Adjust if you like

function init() {
  console.log("Init called");
}

/**
 * Start the game from the menu.
 */
function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";

  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

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

  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

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
  document.getElementById("canvas").style.display = "none";

  let title = document.querySelector("h1");
  if (title) title.style.display = "none";

  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Back to menu");
}

/**
 * Open Settings overlay
 */
function openSettings() {
  document.getElementById("overlay-settings").classList.remove("hidden");
}

/**
 * Close Settings overlay (NO audio on close)
 */
function closeSettings() {
  document.getElementById("overlay-settings").classList.add("hidden");
}

/**
 * Show help (currently just an alert)
 */
function openHelp() {
  alert("Use arrow keys to move, SPACE to jump, D to throw a bottle!");
}

/**
 * Example Impressum
 */
function openImpressum() {
  alert("Example Impressum text here.");
}

/**
 * Toggle background music.
 * If turning OFF, no click sound.
 * If turning ON, play click sound.
 */
function toggleMusic() {
  let musicIcon = document.getElementById("music-icon");

  if (!musicMuted) {
    // Currently ON, now turning OFF
    musicMuted = true;
    musicIcon.src = "img/background/music-cross.png";
    console.log("Music muted.");
    // no click sound
  } else {
    // Currently OFF, now turning ON
    musicMuted = false;
    musicIcon.src = "img/background/music.png";
    console.log("Music unmuted.");
    playButtonClick();
  }

  // TODO: actually mute/unmute your in-game music if you have it
}

/**
 * Toggle sound effects.
 * If turning OFF, no click sound.
 * If turning ON, play click sound.
 */
function toggleSoundEffects() {
  let sfxIcon = document.getElementById("sfx-icon");

  if (!soundEffectsMuted) {
    // Currently ON, turning OFF
    soundEffectsMuted = true;
    sfxIcon.src = "img/background/sound-cross.png";
    console.log("Sound effects muted.");
    // no click sound
  } else {
    // Currently OFF, turning ON
    soundEffectsMuted = false;
    sfxIcon.src = "img/background/sound.png";
    console.log("Sound effects unmuted.");
    playButtonClick();
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
