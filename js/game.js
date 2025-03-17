/***** Globale Variablen *****/
let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;

/** Neu: Globale Mute-Flags für Music und SFX **/
let musicMuted = false;
let sfxMuted = false;

/** Kurzer Klicksound als Standard */
let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0;

function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

function loadCurrentLevel() {
  if (currentLevel === 1) return createLevel1();
  if (currentLevel === 2) return createLevel2();
  return createLevel3();
}

/***** TOGGLE MUSIC *****/
function toggleMusic() {
  // 1) Toggle globale Flag
  musicMuted = !musicMuted;

  // 2) Icon updaten => slash an/aus
  let musicIcon = document.getElementById("music-icon");
  if (musicMuted) {
    musicIcon.classList.add("muted");
  } else {
    musicIcon.classList.remove("muted");
    playButtonClick(); // Klicksound nur beim Unmute
  }

  // 3) Falls schon eine World existiert => dort ebenfalls umsetzen
  if (window.world) {
    world.musicMuted = musicMuted;
    world.backgroundMusic.muted = musicMuted;
  }
}

/***** TOGGLE SFX *****/
function toggleSfx() {
  sfxMuted = !sfxMuted;

  let sfxIcon = document.getElementById("sfx-icon");
  if (sfxMuted) {
    sfxIcon.classList.add("muted");
  } else {
    sfxIcon.classList.remove("muted");
    playButtonClick(); // Klicksound nur beim Unmute
  }

  // Falls World existiert => sync mit world
  if (window.world) {
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
}

/** Spielt kurzen Klicksound ab */
function playButtonClick() {
  let clickSound = new Audio("audio/button-click.mp3");
  clickSound.volume = 1.0;
  clickSound.play();
}

/***** START GAME *****/
function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";
  canvas = document.getElementById("canvas");
  currentLevel = 1;

  world = new World(canvas, keyboard);

  // Musik & SFX-Status übernehmen:
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

  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  if (!musicMuted) {
    world.backgroundMusic.play().catch((err) => console.log(err));
  }
}

/***** RESTART GAME *****/
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

  // Musik & SFX-Status übernehmen
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

  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);
}

/***** NEXT LEVEL *****/
function goToNextLevel() {
  let stats = storeCurrentStats();
  playLevelCompleteSound();
  showLevelCompleteOverlay(currentLevel);

  setTimeout(() => {
    hideLevelCompleteOverlay();
    currentLevel++;
    if (currentLevel > 3) return;

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
  let levelCompleteAudio = new Audio("audio/level-complete.mp3");
  levelCompleteAudio.play().catch((e) => console.log(e));
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

function calcCoinPercentage(coinCount) {
  let percentage = coinCount * 10;
  return percentage > 100 ? 100 : percentage;
}

function calcBottlePercentage(bottleCount) {
  let percentage = bottleCount * 20;
  return percentage > 100 ? 100 : percentage;
}

function goToMenu() {
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  document.getElementById("canvas").style.display = "none";
  let title = document.querySelector("h1");
  if (title) title.style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Back to menu");
}

function openSettings() {
  document.getElementById("overlay-settings").classList.remove("hidden");
}
function closeSettings() {
  document.getElementById("overlay-settings").classList.add("hidden");
}
function openHelp() {
  document.getElementById("overlay-help").classList.remove("hidden");
}
function closeHelp() {
  document.getElementById("overlay-help").classList.add("hidden");
}
function openImpressum() {
  document.getElementById("overlay-impressum").classList.remove("hidden");
}
function closeImpressum() {
  document.getElementById("overlay-impressum").classList.add("hidden");
}

/***** FULLSCREEN UND PAUSE *****/
const fsBtn = document.getElementById("btn-fullscreen");
if (fsBtn) {
  fsBtn.addEventListener("keydown", (e) => {
    if (e.key === " " || e.keyCode === 32) e.preventDefault();
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {});
  } else {
    document.exitFullscreen().catch((err) => {});
  }
  document.getElementById("btn-fullscreen").blur();
}

function toggleBreak() {
  const breakBtn = document.getElementById("btn-break");
  if (!window.world) return;
  window.paused = !window.paused;

  if (window.paused) {
    clearAllIntervals();
    setPausedOverlay(true);
    breakBtn.innerText = "Continue";
  } else {
    setPausedOverlay(false);
    breakBtn.innerText = "Break";
  }
}

function setPausedOverlay(isPaused) {
  let c = document.querySelector(".canvas-container");
  if (!c) return;
  if (isPaused) c.classList.add("paused-overlay");
  else c.classList.remove("paused-overlay");
}

function quitGame() {
  if (world) {
    world.stopGame();
    if (world.backgroundMusic) {
      world.backgroundMusic.pause();
      world.backgroundMusic.currentTime = 0;
      world.backgroundMusic.loop = false;
    }
    world = null;
  }
  clearAllIntervals();
  document.getElementById("canvas").style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
}

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
