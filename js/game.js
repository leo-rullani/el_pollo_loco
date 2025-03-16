// game.js

let canvas;
let world;
let keyboard = new Keyboard();

// "Aktuelles Level" als globale Variable:
let currentLevel = 1;

/**
 * Hilfsfunktion:
 * Gibt das gewünschte Levelobjekt (Level 1, 2 oder 3) zurück
 */
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

// Audio für Button-Klicks (nur beim Einschalten von Musik/SFX)
let buttonClickSound = new Audio("audio/button-click.mp3");
buttonClickSound.volume = 1.0;

function init() {
  console.log("Init called");
}

/**
 * Für Musik- & SFX-Toggle-Buttons in HTML
 */
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

/**
 * Startet das Spiel bei Level 1
 */
function startGame() {
  // => Overlay + Canvas sichtbar
  document.getElementById("overlay-menu").classList.add("hidden");
  document.getElementById("canvas").style.display = "block";

  let title = document.querySelector("h1");
  if (title) title.style.display = "block";

  canvas = document.getElementById("canvas");
  currentLevel = 1; // Bei jedem Start => Level 1

  // => Erzeuge leere World
  world = new World(canvas, keyboard);

  // => Lade Level-1-Daten
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  // => Musik an
  world.backgroundMusic.play().catch((err) => console.log(err));

  console.log("Game started in normal browser window (canvas fills the page).");
}

/**
 * Restart: Geht zurück zu Level 1
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

  currentLevel = 1;
  canvas = document.getElementById("canvas");

  // => Neue World
  world = new World(canvas, keyboard);
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);

  console.log("Restarted game, character is", world.character);
}

/**
 * Wechselt vom aktuellen Level => nächstes Level
 * OHNE eine neue World zu erzeugen.
 * => Erst Overlay + Sound "Level X Completed" mit altem Level-Wert,
 * => Dann nach kurzer Zeit: currentLevel++ und loadNextLevelData, Stats übernehmen.
 */
function goToNextLevel() {
  let oldEnergy = world.character.energy;
  let oldCoins = world.coinsCollected;
  let oldBottles = world.bottlesCollected;

  // Sound + Overlay
  playLevelCompleteSound();
  showLevelCompleteOverlay(currentLevel);

  // Nach 1 Sek. Overlay weg, Level++ usw.
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

    // alte Werte wiederherstellen
    world.character.energy = oldEnergy;
    world.coinsCollected = oldCoins;
    world.bottlesCollected = oldBottles;

    // StatusBars updaten
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

/* Overlays */
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

/* Toggle background music (Icon only) */
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

/* Toggle sound effects (Icon only) */
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

/* Plays short button click sound */
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

/**
 * Fullscreen-TOGGLE (Browserfenster).
 * Klick 1 => requestFullscreen(), Klick 2 => exitFullscreen().
 * Canvas bleibt immer "width=100%, height=100%".
 */
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

  // NEU: Fokus entfernen => Space triggert keinen Klick mehr
  document.getElementById('btn-fullscreen').blur();
}

/* Pausiert / ent-pausiert das Spiel */
function toggleBreak() {
  const breakBtn = document.getElementById("btn-break");
  if (!window.world) return;

  world.paused = !world.paused;
  if (world.paused) {
    breakBtn.innerText = "Continue";
    console.log("Game paused");
  } else {
    breakBtn.innerText = "Break";
    console.log("Game continued");
  }
}

let intervalIds = [];

intervalIds.push(interval);
/* Spiel beenden => Zurück zum Menu */
function quitGame() {
  if (window.world) {
    world.stopGame();
    world.backgroundMusic.pause();
    world = null;
  }
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('overlay-menu').classList.remove('hidden');
  console.log("Quit game => Back to menu");
  intervalIds.forEach(clearInterval);
}