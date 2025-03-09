let canvas; 
let world; 
let keyboard = new Keyboard(); 

function init() {
  // Im Zweifel machst du hier gar nichts oder nur minimal.
  // Wir lassen init() so, falls du es für was anderes brauchst.
  console.log("Init called");
}

/** 
 * Startet das Spiel aus dem Menü heraus.
 * Zeigt Canvas + h1 und blendet das Menü aus.
 */
function startGame() {
  // 1) Menü-Overlay unsichtbar machen
  document.getElementById('overlay-menu').classList.add('hidden');

  // 2) Canvas + H1 einblenden (falls du sie anfangs per style="display:none" ausblendest)
  document.getElementById('canvas').style.display = 'block';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  // 3) Neues Level + World
  canvas = document.getElementById("canvas");
  let level = createLevel1();
  world = new World(canvas, keyboard, level);

  console.log("Game started, character is", world.character);
}

/** 
 * Ruft man auf, wenn Spieler "Restart" oder "Play Again" klickt.
 */
function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  // Canvas + Title sicherstellen, dass sie sichtbar sind
  document.getElementById('canvas').style.display = 'block';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'block';

  // Neues Level + World
  canvas = document.getElementById("canvas");
  let level = createLevel1();
  world = new World(canvas, keyboard, level);

  console.log("Restarted game, character is", world.character);
}

/** 
 * Menü-Button in Game Over / Win
 * Schaltet Overlays aus, versteckt Canvas/H1,
 * und zeigt wieder overlay-menu.
 */
function goToMenu() {
  // Overlays aus
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  // Canvas & H1 wieder ausblenden
  document.getElementById('canvas').style.display = 'none';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'none';

  // Zeige Menü
  document.getElementById('overlay-menu').classList.remove('hidden');

  // optional: world.stopGame(); 
  console.log("Back to menu");
}

function openSettings() {
  alert("No settings yet!");
}

function openHelp() {
  alert("Use arrow keys to move, SPACE to jump, D to throw a bottle!");
}

// Deine Key-Events bleiben unverändert:
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
