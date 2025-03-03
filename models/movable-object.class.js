/* Schablone, welche sagt, welche Felder da drin sein sollen. Lässt sich in game.js integrieren bei Variablen-Definierung: let character = new MovableObject(); */
class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache =
    {}; /* JSON, das Bilder speichert, loadImages-Funktion basierend darauf erstellen */
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;

  loadImage(path) {
    this.img =
      new Image(); /* this.img = document.getElementbyID('image') <img id= "image"> (wäre das gleiche) */
    this.img.src = path;
  }
  /**
   *
   * @param {Array} arr - ['img/image1.png', 'img/image2.png', … ] /* durch diese Bildpfade durchiterieren und zum ImageCache hinzufügen
   */
  loadImages(arr) {
    arr.forEach((path) => {
      /* dieses arr.forEach greift auf die 6 Bilder von Pepe Peligroso (Character) zu */
      let img = new Image(); /* Variable mit neuem Bild wird angelegt */
      img.src = path; /* Bild wird geladen in das Image-Objekt */
      this.imageCache[path] = img;
    }); /* wir machen das für mehrere Bilder und gehen somit durch alle Pfade durch, loadImages inkl. alle Bildpfade (bspw. von Charakter in den jeweiligen Klassen als Array hinzufügen  */
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}