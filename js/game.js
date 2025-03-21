/**
 * The main game script, handling menu actions, level loading,
 * fullscreen toggles, sound management, and more.
 */

// -----------------------------------------------------------
// Global Variables
// -----------------------------------------------------------

/** @type {HTMLCanvasElement|undefined} */
let canvas;

/** @type {World|undefined} */
let world;

/** @type {SoundManager|undefined} */
let soundManager;

/** @type {Keyboard} */
let keyboard = new Keyboard();

/** @type {number} */
let currentLevel = 1;

/** Click sound for menu buttons. */
let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0;

// -----------------------------------------------------------
// Core Functions
// -----------------------------------------------------------

/**
 * Clears all intervals from 1 to 9999.
 * Helps avoid interval conflicts on restarts or quits.
 */
function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

/**
 * Loads the appropriate level data based on currentLevel.
 * @returns {Level} The level data object (level1, level2, or level3).
 */
function loadCurrentLevel() {
  if (currentLevel === 1) return createLevel1();
  if (currentLevel === 2) return createLevel2();
  return createLevel3();
}

/**
 * Toggles background music mute/unmute.
 * Also updates the music icon and world settings if applicable.
 */
function toggleMusic() {
  musicMuted = !musicMuted;
  let musicIcon = document.getElementById("music-icon");
  if (musicMuted) {
    musicIcon.classList.add("muted");
  } else {
    musicIcon.classList.remove("muted");
    playButtonClick();
  }
  if (window.world) {
    world.musicMuted = musicMuted;
    world.backgroundMusic.muted = musicMuted;
  }
}

/**
 * Toggles sound effects mute/unmute.
 */
function toggleSfx() {
  sfxMuted = !sfxMuted;
  updateSfxIcon();
  if (window.world) updateSfxInWorld();
}

/** Updates the SFX icon in the UI based on the sfxMuted state. */
function updateSfxIcon() {
  let sfxIcon = document.getElementById("sfx-icon");
  if (sfxMuted) {
    sfxIcon.classList.add("muted");
  } else {
    sfxIcon.classList.remove("muted");
    playButtonClick();
  }
}

/** Updates all world-related SFX settings (muted or unmuted). */
function updateSfxInWorld() {
  world.sfxMuted = sfxMuted;
  world.chickenDeathSound.muted = sfxMuted;
  world.pepeHurtSound.muted = sfxMuted;
  world.pepeDiesSound.muted = sfxMuted;
  world.endbossDeathSound.muted = sfxMuted;
  world.winGameSound.muted = sfxMuted;
  world.coinSound.muted = sfxMuted;
  world.bottleSound.muted = sfxMuted;
  world.jumpSound.muted = sfxMuted;
  world.bottleShatterSound.muted = sfxMuted;
  world.levelCompleteSound.muted = sfxMuted;
}

/** Plays a short button click sound effect. */
function playButtonClick() {
  let clickSound = new Audio("audio/button-click.mp3");
  clickSound.volume = 1.0;
  clickSound.play();
}

// -----------------------------------------------------------
// Game Start / World Creation
// -----------------------------------------------------------

/**
 * Initializes the canvas, the game world, and the SoundManager at application start.
 * Attaches an event listener to the mute/unmute button to toggle sound.
 */
function init() {
  soundManager = new SoundManager();
  const canvasElem = document.getElementById('canvas');
  world = new World(canvasElem, keyboard);

  // Example: Mute button if it exists
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      soundManager.toggleSound();
    });
  }
}

/**
 * Starts the game by hiding the menu overlay, showing the canvas,
 * creating a new world, and loading the first level.
 */
function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  canvas = document.getElementById("canvas");
  currentLevel = 1;

  // SoundManager
  soundManager = new SoundManager();

  // Create the world
  world = new World(canvas, keyboard);

  setupWorldAudio();

  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  if (!musicMuted) {
    world.backgroundMusic.play().catch((err) => console.log(err));
  }
}

/** Applies current music/SFX mute states to the newly created world. */
function setupWorldAudio() {
  world.musicMuted = musicMuted;
  world.backgroundMusic.muted = musicMuted;
  world.sfxMuted = sfxMuted;
  world.chickenDeathSound.muted = sfxMuted;
  world.pepeHurtSound.muted = sfxMuted;
  world.pepeDiesSound.muted = sfxMuted;
  world.endbossDeathSound.muted = sfxMuted;
  world.winGameSound.muted = sfxMuted;
  world.coinSound.muted = sfxMuted;
  world.bottleSound.muted = sfxMuted;
  world.jumpSound.muted = sfxMuted;
  world.bottleShatterSound.muted = sfxMuted;
  world.levelCompleteSound.muted = sfxMuted;
}

/**
 * Restarts the game by stopping the current world, hiding overlays,
 * recreating the world, and loading the current level again.
 */
function restartGame() {
  if (world) world.stopGame();

  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  if (!world.musicMuted) {
    world.backgroundMusic.play().catch((e) => {});
  }
}

/** Returns to the main menu by hiding overlays and canvas. */
function goToMenu() {
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  document.getElementById("canvas").style.display = "none";
  let title = document.querySelector("h1");
  if (title) title.style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Back to menu");
}

// -----------------------------------------------------------
// Level / Stats / Overlays
// -----------------------------------------------------------

function goToNextLevel() {
  let stats = storeCurrentStats();
  showLevelCompleteOverlay(currentLevel);
  setTimeout(() => {
    hideLevelCompleteOverlay();
    currentLevel++;
    if (currentLevel > 3) return;
    playLevelCompleteSound();
    world.loadLevelData(loadCurrentLevel(), currentLevel);
    restoreStats(stats);
  }, 1000);
}

function storeCurrentStats() {
  return {
    oldEnergy: world.character.energy,
    oldCoins: world.coinsCollected,
    oldBottles: world.bottlesCollected,
  };
}

function restoreStats(stats) {
  world.character.energy = stats.oldEnergy;
  world.coinsCollected = stats.oldCoins;
  world.bottlesCollected = stats.oldBottles;
  world.statusBar.setPercentage(stats.oldEnergy);
  world.coinBar.setPercentage(calcCoinPercentage(stats.oldCoins));
  world.bottleBar.setPercentage(calcBottlePercentage(stats.oldBottles));
}

function hideLevelCompleteOverlay() {
  let overlay = document.getElementById("overlay-levelcomplete");
  if (overlay) overlay.classList.add("hidden");
}

function playLevelCompleteSound() {
  if (window.world) {
    world.levelCompleteSound.currentTime = 0;
    world.levelCompleteSound.play().catch((e) => console.log(e));
  }
}

function showLevelCompleteOverlay(levelNumber) {
  let overlay = document.getElementById("overlay-levelcomplete");
  if (!overlay) {
    console.warn("No #overlay-levelcomplete found in HTML!");
    return;
  }
  overlay.innerHTML = `<h1>Level ${levelNumber} Completed!</h1>`;
  overlay.classList.remove("hidden");
}

/**
 * Converts the given coin count to a percentage (max 100).
 * @param {number} coinCount - The number of collected coins.
 * @returns {number} A value between 0 and 100.
 */
function calcCoinPercentage(coinCount) {
  let percentage = coinCount * 10;
  return percentage > 100 ? 100 : percentage;
}

/**
 * Converts the given bottle count to a percentage (max 100).
 * @param {number} bottleCount - The number of collected bottles.
 * @returns {number} A value between 0 and 100.
 */
function calcBottlePercentage(bottleCount) {
  let percentage = bottleCount * 20;
  return percentage > 100 ? 100 : percentage;
}

// -----------------------------------------------------------
// Quit / Pause / Fullscreen
// -----------------------------------------------------------

function quitGame() {
  if (world) quitGameCleanup();
  resetPauseIcons();
  clearAllIntervals();
  document.getElementById("canvas").style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Quit game => Pause overlay reset, back to menu");
}

function quitGameCleanup() {
  world.stopGame();
  if (world.backgroundMusic) {
    world.backgroundMusic.pause();
    world.backgroundMusic.currentTime = 0;
    world.backgroundMusic.loop = false;
  }
  world = null;
  window.paused = false;
  setPausedOverlay(false);
}

function resetPauseIcons() {
  const pauseContent = document.getElementById("pause-content");
  const playContent = document.getElementById("play-content");
  if (pauseContent && playContent) {
    pauseContent.style.display = "inline-flex";
    playContent.style.display = "none";
  }
}

function toggleBreak() {
  const breakBtn = document.getElementById("btn-break");
  const pauseContent = document.getElementById("pause-content");
  const playContent = document.getElementById("play-content");
  window.paused = !window.paused;
  world.paused = window.paused;
  handlePauseState(breakBtn, pauseContent, playContent);
}

function handlePauseState(breakBtn, pauseContent, playContent) {
  if (window.paused) {
    world.pauseGame();
    setPausedOverlay(true);
    pauseContent.style.display = "none";
    playContent.style.display = "inline-flex";
  } else {
    world.resumeGame();
    setPausedOverlay(false);
    playContent.style.display = "none";
    pauseContent.style.display = "inline-flex";
    breakBtn.blur();
  }
}

/**
 * Adds or removes the "paused-overlay" class on the canvas container,
 * depending on the isPaused parameter.
 * @param {boolean} isPaused - Whether the game is currently paused.
 */
function setPausedOverlay(isPaused) {
  let c = document.querySelector(".canvas-container");
  if (!c) return;
  if (isPaused) c.classList.add("paused-overlay");
  else c.classList.remove("paused-overlay");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {});
  } else {
    document.exitFullscreen().catch((err) => {});
  }
  document.getElementById("btn-fullscreen")?.blur();
}

/**
 * Checks if the screen is in landscape mode. If not, shows a "rotate device" overlay,
 * called on window load and resize events.
 */
function checkRotateOverlay() {
  const overlay = document.getElementById("overlay-rotate");
  if (!overlay) return;
  if (window.innerWidth > window.innerHeight) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
  }
}
window.addEventListener("load", checkRotateOverlay);
window.addEventListener("resize", checkRotateOverlay);

/**
 * Opens the Settings overlay by removing the 'hidden' class.
 */
function openSettings() {
  const overlay = document.getElementById('overlay-settings');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

/**
 * Closes the Settings overlay by adding the 'hidden' class.
 */
function closeSettings() {
  const overlay = document.getElementById('overlay-settings');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * Opens the Help overlay.
 */
function openHelp() {
  const overlay = document.getElementById('overlay-help');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

/**
 * Closes the Help overlay.
 */
function closeHelp() {
  const overlay = document.getElementById('overlay-help');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * Opens the Impressum overlay.
 */
function openImpressum() {
  const overlay = document.getElementById('overlay-impressum');
  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

/**
 * Closes the Impressum overlay.
 */
function closeImpressum() {
  const overlay = document.getElementById('overlay-impressum');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}