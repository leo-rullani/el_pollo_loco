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
  speedY= 0;
  acceleration = 2.5;

  applyGravity(){
    setInterval(() => {
      if(this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround(){
    return this.y < 180;
  }

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
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
      this.x -= this.speed;
      this.otherDirection = true;
   
  }
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }  

  jump() {
    this.speedY = 30;
  }
}
