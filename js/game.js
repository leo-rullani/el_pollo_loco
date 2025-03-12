// game.js

let canvas; 
let world; 
let keyboard = new Keyboard();

// "Aktuelles Level" als globale Variable:
let currentLevel = 1;

/** 
 * Hilfsfunktion: 
 * Gibt das gewünschte Levelobjekt (Level 1, 2 oder 3) zurück,
 * also enemies, coins, backgroundObjects etc.
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
buttonClickSound.volume = 1.0; // anpassen, falls zu laut

function init() {
  console.log("Init called");
}

/**
 * Diese Funktionen toggeln Musik + SFX in der "World"
 * (für Buttons in HTML).
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
 * Start das Spiel bei Level 1
 */
function startGame() {
  document.getElementById('overlay-menu').classList.add('hidden');
  document.getElementById('canvas').style.display = 'block';

  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  canvas = document.getElementById("canvas");

  // => 1) Setze currentLevel auf 1
  currentLevel = 1;

  // => 2) Erzeuge eine "leere" World (OHNE Level-Daten)
  //    In world.class.js wird der Konstruktor so angepasst,
  //    dass er KEIN "level" direkt setzt.
  world = new World(canvas, keyboard);

  // => 3) Lade die Level-1-Daten:
  let levelData = loadCurrentLevel(); // => createLevel1()
  // => 4) Rufe loadLevelData() auf, das die Arrays (enemies, coins usw.) übernimmt
  world.loadLevelData(levelData);

  // => 5) Musik abspielen
  world.backgroundMusic.play().catch(err => console.log(err));
}

/** 
 * Restart: Geht auch immer zurück zu Level 1
 */
function restartGame() {
  if (world) {
    // => hier machen wir "stopGame()" 
    //    (wenn wir es so wollen – z.B. alle Intervalle beenden)
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  document.getElementById('canvas').style.display = 'block';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  // => Wieder Level 1
  currentLevel = 1;
  canvas = document.getElementById("canvas");

  // => Neue World (frisch)
  world = new World(canvas, keyboard);
  let levelData = loadCurrentLevel(); // => Level 1
  world.loadLevelData(levelData);

  console.log("Restarted game, character is", world.character);
}

/**
 * Wechselt von aktuellem Level => nächstes Level
 * OHNE neue World zu erzeugen. 
 * => Wir tauschen nur die Arrays (Enemies, Clouds, Coins, etc.)
 */
function goToNextLevel() {
  // 1) Alte Werte sichern
  let oldEnergy = world.character.energy;
  let oldCoins = world.coinsCollected;
  let oldBottles = world.bottlesCollected;

  currentLevel++;
  if (currentLevel > 3) {
    console.log("Alle Levels abgeschlossen!");
    return;
  }

  // => 2) Lade das neue Level-Objekt
  let newLevelData = loadCurrentLevel(); 
    // => createLevel2() oder createLevel3()
  
  // => 3) In der WORLD "loadLevelData()" aufrufen
  world.loadLevelData(newLevelData);

  // => 4) Alte Werte wiederherstellen
  world.character.energy = oldEnergy;
  world.coinsCollected = oldCoins;
  world.bottlesCollected = oldBottles;

  // => Statusbars updaten
  world.statusBar.setPercentage(oldEnergy);

  let coinPercent = calcCoinPercentage(oldCoins);
  world.coinBar.setPercentage(coinPercent);

  let bottlePercent = calcBottlePercentage(oldBottles);
  world.bottleBar.setPercentage(bottlePercent);

  // => Keine new World, keine stopGame() => Minimales Stocken
  // => Musik läuft durch
  // => Alles bleibt so, 
  // => wir haben nur Arrays ausgetauscht
  console.log(`Switched to Level ${currentLevel} with old stats (HP:${oldEnergy}, coins:${oldCoins}, bottles:${oldBottles})`);
}

function calcCoinPercentage(coinCount) {
  // Beispiel: Jede Coin = 10% => 10 coins = 100%
  let percentage = coinCount * 10;
  if (percentage > 100) percentage = 100;
  return percentage;
}

function calcBottlePercentage(bottleCount) {
  // Jede Bottle = 20% => 5 bottles = 100%
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
 * Open/Close Overlays ...
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
 * In "toggleMusic()" oben rufst du world.toggleMusicMute() auf.
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
  // TODO: Actually call world.toggleMusicMute() if you want to link it
}

/** 
 * Toggle sound effects (Icon only).
 * Actually call "world.toggleSfxMute()" to mute them in the game.
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
    playButtonClick(); // only on turning ON
  }
  // TODO: world.toggleSfxMute()
}

/** 
 * Plays short button click sound (only used when toggling ON).
 */
function playButtonClick() {
  buttonClickSound.currentTime = 0;
  buttonClickSound.play();
}

/** 
 * Key events (unchanged, just logs plus sets "keyboard" states)
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
