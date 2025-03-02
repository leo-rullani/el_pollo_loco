/* Schablone, welche sagt, welche Felder da drin sein sollen. Lässt sich in game.js integrieren bei Variablen-Definierung: let character = new MovableObject(); */
class MovableObject {
  x = 120;
  y = 400;
  img;

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {}
}
