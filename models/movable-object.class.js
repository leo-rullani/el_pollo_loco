/* Schablone, welche sagt, welche Felder da drin sein sollen. Lässt sich in game.js integrieren bei Variablen-Definierung: let character = new MovableObject(); */
class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image(); /* this.img = document.getElementbyID('image') <img id= "image"> (wäre das gleiche) */
    this.img.src = path; 
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {}
}
