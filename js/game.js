let canvas;
let world;
let keyboard = new Keyboard();
let currentLevel = 1;

function clearAllIntervals() {
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
  console.log("All intervals cleared (hacky method).");
}


function loadCurrentLevel() {
  if (currentLevel === 1) {
    return createLevel1();
  } else if (currentLevel === 2) {
    return createLevel2(); 
  } else {
    // => Level 3
    return createLevel3();
  }
}

let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0;

function init() {
  console.log("Init called");
}

function toggleMusic() {
  if (window.world) {
    world.toggleMusicMute();
  }
}

function toggleSfx() {
  if (window.world) {
    world.toggleSfxMute();
  }
}

function startGame() {
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";

  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  canvas = document.getElementById("canvas");
  currentLevel = 1; 


  world = new World(canvas, keyboard);

  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);


  world.backgroundMusic.play().catch((err) => console.log(err));

  console.log("Game started in normal browser window (canvas fills the page).");
}

function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  document.getElementById("canvas").style.display = "block";
  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  currentLevel = 1;
  canvas = document.getElementById("canvas");

  world = new World(canvas, keyboard);
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  console.log("Restarted game, character is", world.character);
}


function goToNextLevel() {
  let oldEnergy = world.character.energy;
  let oldCoins = world.coinsCollected;
  let oldBottles = world.bottlesCollected;

  playLevelCompleteSound();
  showLevelCompleteOverlay(currentLevel);

  setTimeout(() => {
    let overlay = document.getElementById("overlay-levelcomplete");
    if (overlay) overlay.classList.add("hidden");

    currentLevel++;
    if (currentLevel > 3) {
      console.log("Alle Levels abgeschlossen!");
      return;
    }

    let newLevelData = loadCurrentLevel();
    world.loadLevelData(newLevelData, currentLevel);

    world.character.energy = oldEnergy;
    world.coinsCollected = oldCoins;
    world.bottlesCollected = oldBottles;

    world.statusBar.setPercentage(oldEnergy);
    world.coinBar.setPercentage(calcCoinPercentage(oldCoins));
    world.bottleBar.setPercentage(calcBottlePercentage(oldBottles));

    console.log(
      `Switched to Level ${currentLevel} with old stats (HP:${oldEnergy}, coins:${oldCoins}, bottles:${oldBottles})`
    );
  }, 1000);
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

function toggleMusic() {
  let musicIcon = document.getElementById("music-icon");
  if (!musicMuted) {
    musicMuted = true;
    musicIcon.classList.add("muted");
    console.log("Music muted.");
  } else {
    musicMuted = false;
    musicIcon.classList.remove("muted");
    console.log("Music unmuted.");
    playButtonClick();
  }
}

function toggleSoundEffects() {
  let sfxIcon = document.getElementById("sfx-icon");
  if (!soundEffectsMuted) {
    soundEffectsMuted = true;
    sfxIcon.classList.add("muted");
    console.log("Sound effects muted.");
  } else {
    soundEffectsMuted = false;
    sfxIcon.classList.remove("muted");
    console.log("Sound effects unmuted.");
    playButtonClick();
  }
}

function playButtonClick() {
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
}

const fsBtn = document.getElementById('btn-fullscreen');
if (fsBtn) {
  fsBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.keyCode === 32) {
      e.preventDefault();
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Fehler bei Fullscreen:", err);
    });
    console.log("Entered real fullscreen (browser).");
  } else {
    document.exitFullscreen().catch((err) => {
      console.error("Fehler beim Exit Fullscreen:", err);
    });
    console.log("Exited real fullscreen, back to normal window size.");
  }

  document.getElementById('btn-fullscreen').blur();
}

function toggleBreak() {
  const breakBtn = document.getElementById("btn-break");
  if (!window.world) return;

  window.paused = !window.paused; 

  if (window.paused) {

    clearAllIntervals();

    let canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      canvasContainer.classList.add('paused-overlay');
    }

    breakBtn.innerText = "Continue";
    console.log("Game paused (via clearAllIntervals).");
  } else {
 
    let canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      canvasContainer.classList.remove('paused-overlay');
    }
    
    breakBtn.innerText = "Break";
    console.log("Game continued (nothing restarted yet).");
  }
}

function quitGame() {
  if (window.world) {
    world.stopGame();

    // Hintergrundmusik komplett stoppen + zurücksetzen
    if (world.backgroundMusic) {
      world.backgroundMusic.loop = false;
      world.backgroundMusic.pause();
      world.backgroundMusic.currentTime = 0;
    }    

    // Endboss-Musik oder sonstige Loops ausschalten?
    // if (world.endbossDeathSound) {
    //   world.endbossDeathSound.pause();
    //   world.endbossDeathSound.currentTime = 0;
    // }

    world = null;
  }
  clearAllIntervals(); 
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('overlay-menu').classList.remove('hidden');
  console.log("Quit game => Back to menu");
}

function checkRotateOverlay() {
  const overlay = document.getElementById('overlay-rotate');
  if (!overlay) return;

  // Beispiel: wenn Querformat => Overlay ausblenden
  if (window.innerWidth > window.innerHeight) {
    overlay.classList.add('hidden'); // => transparent
  } else {
    overlay.classList.remove('hidden'); // => sichtbar
  }
}

window.addEventListener('load', checkRotateOverlay);
window.addEventListener('resize', checkRotateOverlay);