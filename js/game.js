// game.js

let canvas; 
let world; 
let keyboard = new Keyboard();

// "Aktuelles Level" als globale Variable:
let currentLevel = 1;

/** 
 * Helper-Funktion: 
 * Gibt dir das passende Level-Objekt (Level 1, 2, oder 3)
 */
function loadCurrentLevel() {
  if (currentLevel === 1) {
    return createLevel1();
  } else if (currentLevel === 2) {
    return createLevel2();
  } else {
    // Level 3
    return createLevel3();
  }
}

// Audio für Button-Klicks (nur beim Einschalten von Musik/SFX)
let buttonClickSound = new Audio('audio/button-click.mp3');
buttonClickSound.volume = 1.0; // anpassen, falls zu laut

function init() {
  console.log("Init called");
}

/**
 * Diese Funktionen toggeln Musik + SFX in der "World"
 */
function toggleMusic() {
  // Falls du den Button in HTML klickst
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
 * Start the game from the menu.
 * Jetzt immer bei Level 1 anfangen.
 */
function startGame() {
  // 1) Overlays entfernen, Canvas anzeigen
  document.getElementById('overlay-menu').classList.add('hidden');
  document.getElementById('canvas').style.display = 'block';

  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  // 2) Canvas / Level laden
  canvas = document.getElementById("canvas");
  currentLevel = 1;              // Start immer bei Level 1
  let level = loadCurrentLevel(); // => createLevel1()
  world = new World(canvas, keyboard, level);

  // 3) Musik abspielen (falls nicht geblockt)
  world.backgroundMusic.play().catch(err => console.log(err));
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

  // Wieder bei Level 1 anfangen:
  currentLevel = 1;
  canvas = document.getElementById("canvas");
  let level = loadCurrentLevel(); // => createLevel1()
  world = new World(canvas, keyboard, level);

  console.log("Restarted game, character is", world.character);
}

/** 
 * Bei Bedarf: Gehe zum nächsten Level 
 * (wird aufgerufen, sobald World erkennt, dass das Level fertig ist).
 */
function goToNextLevel() {
  // 1) Alte Werte sichern
  let oldEnergy = world.character.energy;
  let oldCoins = world.coinsCollected;
  let oldBottles = world.bottlesCollected;

  world.stopGame();
  currentLevel++;
  if (currentLevel > 3) {
    console.log("Alle Levels abgeschlossen!");
    return;
  }

  let canvas = document.getElementById("canvas");
  let level = loadCurrentLevel();
  // 2) Neue World erstellen
  world = new World(canvas, keyboard, level);

  // 3) Alte Werte direkt zuweisen
  world.character.energy = oldEnergy;
  world.coinsCollected = oldCoins;
  world.bottlesCollected = oldBottles;

  // 4) Statusbars sofort updaten
  // Health-Bar
  world.statusBar.setPercentage(oldEnergy);

  // Coin-Bar
  let coinPercent = calcCoinPercentage(oldCoins);
  world.coinBar.setPercentage(coinPercent);

  // Bottle-Bar
  let bottlePercent = calcBottlePercentage(oldBottles);
  world.bottleBar.setPercentage(bottlePercent);

  // Musik
  world.backgroundMusic.play().catch(err => console.log(err));
}

function calcCoinPercentage(coinCount) {
  // Beispiel: Jede Coin = 10% (bei 10 = 100%)
  let percentage = coinCount * 10;
  if (percentage > 100) percentage = 100;
  return percentage;
}

function calcBottlePercentage(bottleCount) {
  // Beispiel: Jede Bottle = 20% (bei 5 = 100%)
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
 * 
 * (Diese Funktion toggelt NUR das Symbol. 
 *  Um World-Musik stummzuschalten, brauchst du "toggleMusic()" oben.)
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
  // TODO: eigentlich solltest du hier "world.toggleMusicMute()" aufrufen
  //  oder musicMuted in world übernehmen
}

/** 
 * Toggle sound effects.
 * If turning OFF, no click sound.
 * If turning ON, play click sound.
 * 
 * (Diese Funktion toggelt NUR das Icon. 
 *  Um Sound-Effekte stummzuschalten, brauchst du "toggleSfx()" oben.)
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
  // TODO: eigentlich solltest du hier "world.toggleSfxMute()" aufrufen
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