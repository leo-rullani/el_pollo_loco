/**
 * The main game script, handling menu actions, level loading, fullscreen toggles, sound management, and more.
 */

let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;

/** Indicates if background music is muted. */
let musicMuted = false;
/** Indicates if sound effects (SFX) are muted. */
let sfxMuted = false;

/** Click sound for menu buttons. */
let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0;

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
 * Toggles sound effects mute/unmute, splitting into two helper functions so as not to exceed 14 lines.
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

/**
 * Starts the game by hiding the menu overlay, showing the canvas, creating a new world, and loading the first level.
 */
function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  canvas = document.getElementById("canvas");
  currentLevel = 1;
  world = new World(canvas, keyboard);
  setupWorldAudio();
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);
  if (!musicMuted)
    world.backgroundMusic.play().catch((err) => console.log(err));
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
 * Restarts the game from level 1, hiding 'game over' or 'you win' overlays, and creating a fresh world with the initial audio settings.
 */
function restartGame() {
  if (world) world.stopGame();
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  currentLevel = 1;
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  setupWorldAudio();
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);
}

/**
 * Moves the game on to the next level, preserving stats, and playing a level-complete sound if not past the last level.
 */
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

/**
 * Stores certain character/world properties (energy, coins, bottles)so they can be restored after loading a new level.
 * @returns {{oldEnergy: number, oldCoins: number, oldBottles: number}}
 */
function storeCurrentStats() {
  return {
    oldEnergy: world.character.energy,
    oldCoins: world.coinsCollected,
    oldBottles: world.bottlesCollected,
  };
}

/**
 * Restores the character's energy, coin count, and bottle count after a new level is loaded, also updating status bars accordingly.
 * @param {{oldEnergy: number, oldCoins: number, oldBottles: number}} stats - The stored stats.
 */
function restoreStats(stats) {
  world.character.energy = stats.oldEnergy;
  world.coinsCollected = stats.oldCoins;
  world.bottlesCollected = stats.oldBottles;
  world.statusBar.setPercentage(stats.oldEnergy);
  world.coinBar.setPercentage(calcCoinPercentage(stats.oldCoins));
  world.bottleBar.setPercentage(calcBottlePercentage(stats.oldBottles));
}

/** Hides the "level complete" overlay if it exists in the DOM. */
function hideLevelCompleteOverlay() {
  let overlay = document.getElementById("overlay-levelcomplete");
  if (overlay) overlay.classList.add("hidden");
}

/** Plays the level-complete sound from the start if the world is defined. */
function playLevelCompleteSound() {
  if (window.world) {
    world.levelCompleteSound.currentTime = 0;
    world.levelCompleteSound.play().catch((e) => console.log(e));
  }
}

/**
 * Shows the "level complete" overlay with the provided level number.
 * @param {number} levelNumber - The completed level number.
 */
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

/**
 * Returns the user to the main menu by hiding the canvas and overlays,and showing the menu overlay again.
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

/** Shows the settings overlay. */
function openSettings() {
  document.getElementById("overlay-settings").classList.remove("hidden");
}

/** Hides the settings overlay. */
function closeSettings() {
  document.getElementById("overlay-settings").classList.add("hidden");
}

/** Shows the help overlay. */
function openHelp() {
  document.getElementById("overlay-help").classList.remove("hidden");
}

/** Hides the help overlay. */
function closeHelp() {
  document.getElementById("overlay-help").classList.add("hidden");
}

/** Shows the impressum overlay. */
function openImpressum() {
  document.getElementById("overlay-impressum").classList.remove("hidden");
}

/** Hides the impressum overlay. */
function closeImpressum() {
  document.getElementById("overlay-impressum").classList.add("hidden");
}

const fsBtn = document.getElementById("btn-fullscreen");
if (fsBtn) {
  fsBtn.addEventListener("keydown", (e) => {
    if (e.key === " " || e.keyCode === 32) e.preventDefault();
  });
}

/**
 * Toggles the browser fullscreen mode on or off, also blurs the fullscreen button to avoid focus states.
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {});
  } else {
    document.exitFullscreen().catch((err) => {});
  }
  document.getElementById("btn-fullscreen").blur();
}

/**
 * Pauses or resumes the game, toggling the pause overlay and icons, split to helper method to keep function short.
 */
function toggleBreak() {
  const breakBtn = document.getElementById("btn-break");
  const pauseContent = document.getElementById("pause-content");
  const playContent = document.getElementById("play-content");
  window.paused = !window.paused;
  world.paused = window.paused;
  handlePauseState(breakBtn, pauseContent, playContent);
}

/**
 * Updates the UI and world state based on whether the game is paused or resumed.
 */
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
 * Adds or removes the "paused-overlay" class on the canvas container,depending on the isPaused parameter.
 * @param {boolean} isPaused - Whether the game is currently paused.
 */
function setPausedOverlay(isPaused) {
  let c = document.querySelector(".canvas-container");
  if (!c) return;
  if (isPaused) c.classList.add("paused-overlay");
  else c.classList.remove("paused-overlay");
}

/**
 * Quits the current game, stops all intervals, pauses music, and returns to the menu overlay.
 */
function quitGame() {
  if (world) quitGameCleanup();
  resetPauseIcons();
  clearAllIntervals();
  document.getElementById("canvas").style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Quit game => Pause overlay reset, back to menu");
}

/** Stops the world, pauses music, and removes the world reference. */
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

/** Resets the pause/play icons to their default state. */
function resetPauseIcons() {
  const pauseContent = document.getElementById("pause-content");
  const playContent = document.getElementById("play-content");
  if (pauseContent && playContent) {
    pauseContent.style.display = "inline-flex";
    playContent.style.display = "none";
  }
}

/**
 * Checks if the screen is in landscape mode. If not, shows a "rotate device" overlay, called on window load and resize events.
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