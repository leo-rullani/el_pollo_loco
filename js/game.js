let canvas; /* DIESE 2 VARIABLEN WERDEN IN DER INIT-FUNKTION AUFGERUFEN */
let world; /* Step 2: wir legen ein neues Objekt namens world an und diese geben wir canvas als Variable mit */
let keyboard = new Keyboard(); /* erstellte Instanz für Objekt/Klasse */

/* die Init-Methode soll letztendlich auf das Canvas zugreifen und eine Methode aufrufen, die unser Canvas an eine Variable bindet */
function init() {
  canvas =
    document.getElementById(
      "canvas"
    ); /* Step 1: das canvas aus dem HTML wird hier zugewiesen dem canvas */
  world = new World(canvas, keyboard);
  ctx =
    canvas.getContext(
      "2d"
    ); /* mit der Variable ctx Funktionen aufrufen: Bsp. drawImage */

  console.log("My character is", world.character); /*chracter = MovableObject */
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
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
});