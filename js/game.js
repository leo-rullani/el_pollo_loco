let canvas;
let ctx; /* Objekt, das dafür verantwortlich ist, um auf das Canvas zu malen */

let world = new World();

/* die Init-Methode soll letztendlich auf das Canvas zugreifen und eine Methode aufrufen, die unser Canvas an eine Variable bindet */
function init() {
  canvas = document.getElementById("canvas");
  ctx =
    canvas.getContext(
      "2d"
    ); /* mit der Variable ctx Funktionen aufrufen: Bsp. drawImage */

    console.log('My character is', world.character); /*chracter = MovableObject */
}