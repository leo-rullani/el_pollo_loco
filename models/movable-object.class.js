// movable-object.class.js

class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  gravityInterval;

  /**
   * Wendet Schwerkraft auf das Objekt an.
   * - Charakter: Beendet das Interval NICHT (kann immer wieder springen).
   * - Flasche: Sobald sie auf dem Boden landet, wird das Interval gestoppt.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
        if (this instanceof ThrowableObject) {
          this.onGroundHit();
          clearInterval(this.gravityInterval);
        }
      }
    }, 1000 / 25);
  }

  /**
   * Bestimmt, ob das Objekt "über dem Boden" ist.
   * - Flasche: Boden bei y=360
   * - Andere Objekte (z. B. Character): Boden bei y=180 (Anpassen falls nötig!)
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 360;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Kollisionserkennung
   * @param {MovableObject} mo - anderes MovableObject
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Reduziert die Energie (HP) um 5 und merkt sich den Treffer-Zeitpunkt
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Prüft, ob das Objekt (z. B. Character) kürzlich getroffen wurde
   * => Animation "Hurt" o. Ä.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
    timepassed = timepassed / 1000; // Umwandeln in Sekunden
    return timepassed < 1;
  }

  /**
   * Prüft, ob die Energie (HP) 0 ist => Objekt tot
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Bewegt das Objekt nach rechts
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Bewegt das Objekt nach links
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Wechselt durch die Bild-Array (z. B. Animation-Bilder)
   * @param {Array} images - Array mit Bildpfaden
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Lässt das Objekt springen (z. B. Character)
   */
  jump() {
    this.speedY = 30;
  }
}