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
  energy = 100;
  lastHit = 0;

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

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if(this instanceof Character || this instanceof chicken || this instanceof Endboss) {
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
  }

  //character.isColliding(chicken);
  isColliding(mo) {
    return this.x + this.width > mo.x &&
    this.y + this.height > mo.y &&
    this.x < mo.x &&
    this.y < mo.y + mo.height;
  }

  hit() {
    this.energy -= 5;
    if(this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime(); 
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Difference in ms
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
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
  }

  moveLeft() {
      this.x -= this.speed;
   
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