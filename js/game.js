let canvas; 
let world; 
let keyboard = new Keyboard(); 

function init() {
  canvas = document.getElementById("canvas");
  // 1) Erzeuge frisches Level über createLevel1()
  let level = createLevel1();
  
  // 2) Übergebe das Level beim Erstellen der World
  world = new World(canvas, keyboard, level);

  // Du kannst optional ctx anlegen, wenn du es irgendwo brauchst
  ctx = canvas.getContext("2d");

  console.log("My character is", world.character);
}

function restartGame() {
  // Falls du die Intervalle stoppen willst, 
  // greife auf world.stopGame() zu
  if (world) {
    world.stopGame();
  }

  // Overlays ausblenden
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  // 1) Wieder Canvas selektieren
  canvas = document.getElementById("canvas");

  // 2) Neues Level anlegen
  let level = createLevel1();

  // 3) Neue World mit dem frischen Level
  world = new World(canvas, keyboard, level);

  // Optional: ctx = canvas.getContext("2d");
}

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
