let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;
let musicMuted = false;
let sfxMuted = false;
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

function toggleSfx() {
  sfxMuted = !sfxMuted;

  let sfxIcon = document.getElementById("sfx-icon");
  if (sfxMuted) {
    sfxIcon.classList.add("muted");
  } else {
    sfxIcon.classList.remove("muted");
    playButtonClick();
  }
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

function playButtonClick() {
  let clickSound = new Audio("audio/button-click.mp3");
  clickSound.volume = 1.0;
  clickSound.play();
}

function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";
  canvas = document.getElementById("canvas");
  currentLevel = 1;
  world = new World(canvas, keyboard);
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
  const pauseContent = document.getElementById("pause-content"); 
  const playContent = document.getElementById("play-content");   
  window.paused = !window.paused;
  world.paused = window.paused;
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
  window.paused = false;
  setPausedOverlay(false);
  const pauseContent = document.getElementById("pause-content");
  const playContent = document.getElementById("play-content");
  if (pauseContent && playContent) {
    pauseContent.style.display = "inline-flex";
    playContent.style.display = "none";
  }
  clearAllIntervals();
  document.getElementById("canvas").style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
  console.log("Quit game => Pause overlay reset, back to menu");
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