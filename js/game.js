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
let buttonClickSound = new Audio('audio/button-click.mp3');
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
  document.getElementById('overlay-menu').classList.add('hidden');
  document.getElementById('canvas').style.display = 'block';

  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  canvas = document.getElementById("canvas");
  currentLevel = 1; // Bei jedem Start => Level 1

  // 1) Erzeuge "leere" World (fortgeschrittener Ansatz)
  world = new World(canvas, keyboard);

  // 2) Lade die Level-1-Daten:
  let levelData = loadCurrentLevel(); 
  // => world.loadLevelData(...) erwartet 2 Parameter: (newLevel, levelNumber)?
  // => Wenn du in "world.class.js" loadLevelData(newLevel, levelNumber) definiert hast:
  world.loadLevelData(levelData, currentLevel);

  // 3) Musik abspielen
  world.backgroundMusic.play().catch(err => console.log(err));
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

  document.getElementById('canvas').style.display = 'block';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  currentLevel = 1;
  canvas = document.getElementById("canvas");

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
  // 1) Charakterwerte sichern
  let oldEnergy = world.character.energy;
  let oldCoins = world.coinsCollected;
  let oldBottles = world.bottlesCollected;

  // 2) "Level Completed"-Sound
  playLevelCompleteSound();

  // 3) Overlay mit *altem* Level
  showLevelCompleteOverlay(currentLevel);

  // 4) Warte 1 Sekunde, DANN level++ und lade neues Level
  setTimeout(() => {
    // Overlay verstecken
    let overlay = document.getElementById('overlay-levelcomplete');
    if (overlay) {
      overlay.classList.add('hidden');
    }

    // => Level jetzt hochzählen
    currentLevel++;
    if (currentLevel > 3) {
      console.log("Alle Levels abgeschlossen!");
      // => Optional: "YouWin" 
      return;
    }

    // => Lade neue Level-Daten
    let newLevelData = loadCurrentLevel(); 
    // => World soll in loadLevelData(...) "levelNumber" übernehmen
    world.loadLevelData(newLevelData, currentLevel);

    // => Alte Werte wiederherstellen
    world.character.energy = oldEnergy;
    world.coinsCollected = oldCoins;
    world.bottlesCollected = oldBottles;

    // => StatusBars updaten
    world.statusBar.setPercentage(oldEnergy);
    let coinPercent = calcCoinPercentage(oldCoins);
    world.coinBar.setPercentage(coinPercent);
    let bottlePercent = calcBottlePercentage(oldBottles);
    world.bottleBar.setPercentage(bottlePercent);

    console.log(`Switched to Level ${currentLevel} with old stats (HP:${oldEnergy}, coins:${oldCoins}, bottles:${oldBottles})`);
  }, 1000);
}

/** 
 * Spielt "level-complete.mp3"
 */
function playLevelCompleteSound() {
  let levelCompleteAudio = new Audio('audio/level-complete.mp3');
  levelCompleteAudio.play().catch(e => console.log(e));
}

/** 
 * Overlay: "Level X Completed!"
 */
function showLevelCompleteOverlay(levelNumber) {
  let overlay = document.getElementById('overlay-levelcomplete');
  if (!overlay) {
    console.warn("No #overlay-levelcomplete found in HTML!");
    return;
  }
  overlay.innerHTML = `<h1>Level ${levelNumber} Completed!</h1>`;
  overlay.classList.remove('hidden');
}

/** 
 * Rechnet coinCount => Prozent (max 100)
 */
function calcCoinPercentage(coinCount) {
  let percentage = coinCount * 10;
  if (percentage > 100) percentage = 100;
  return percentage;
}

/** 
 * Rechnet bottleCount => Prozent (max 100)
 */
function calcBottlePercentage(bottleCount) {
  let percentage = bottleCount * 20;
  if (percentage > 100) percentage = 100;
  return percentage;
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
 * Overlays ...
 */
function openSettings() {
  document.getElementById('overlay-settings').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('overlay-settings').classList.add('hidden');
}

function openHelp() {
  document.getElementById('overlay-help').classList.remove('hidden');
}

function closeHelp() {
  document.getElementById('overlay-help').classList.add('hidden');
}

function openImpressum() {
  document.getElementById('overlay-impressum').classList.remove('hidden');
}

function closeImpressum() {
  document.getElementById('overlay-impressum').classList.add('hidden');
}

/** 
 * Toggle background music (Icon only).
 */
function toggleMusic() {
  let musicIcon = document.getElementById('music-icon');
  if (!musicMuted) {
    musicMuted = true;
    musicIcon.classList.add('muted');
    console.log("Music muted.");
  } else {
    musicMuted = false;
    musicIcon.classList.remove('muted');
    console.log("Music unmuted.");
    playButtonClick();
  }
}

/** 
 * Toggle sound effects (Icon only).
 */
function toggleSoundEffects() {
  let sfxIcon = document.getElementById('sfx-icon');
  if (!soundEffectsMuted) {
    soundEffectsMuted = true;
    sfxIcon.classList.add('muted');
    console.log("Sound effects muted.");
  } else {
    soundEffectsMuted = false;
    sfxIcon.classList.remove('muted');
    console.log("Sound effects unmuted.");
    playButtonClick();
  }
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
  if (e.keyCode === 37) keyboard.LEFT = true;
  if (e.keyCode === 39) keyboard.RIGHT = true;
  if (e.keyCode === 38) keyboard.UP = true;
  if (e.keyCode === 40) keyboard.DOWN = true;
  if (e.keyCode === 32) keyboard.SPACE = true;
  if (e.keyCode === 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 37) keyboard.LEFT = false;
  if (e.keyCode === 39) keyboard.RIGHT = false;
  if (e.keyCode === 38) keyboard.UP = false;
  if (e.keyCode === 40) keyboard.DOWN = false;
  if (e.keyCode === 32) keyboard.SPACE = false;
  if (e.keyCode === 68) keyboard.D = false;
});

function toggleFullscreen() {
  let btn = document.getElementById('btn-fullscreen');
  let canvas = document.getElementById('canvas');

  // Prüfen, ob wir gerade im Vollbild sind
  if (!document.fullscreenElement) {
    // => Vollbild aktivieren
    document.documentElement.requestFullscreen().catch(err => {
      console.error("Fehler bei Fullscreen:", err);
    });
    // Canvas vergrößern
    canvas.style.width = "85%";
    canvas.style.height = "85%";

    // Button-Text ändern
    btn.innerText = "Exit Fullscreen";
  } else {
    // => Vollbild verlassen
    document.exitFullscreen();

    // Canvas zurück auf Standardgröße
    canvas.style.width = "720px";
    canvas.style.height = "480px";

    // Button-Text ändern
    btn.innerText = "Fullscreen";
  }
}