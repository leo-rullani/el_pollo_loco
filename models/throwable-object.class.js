class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  // Neues Flag
  landed = false;

  constructor(x, y, world) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.world = world;
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_ON_GROUND);
    this.width = 50;
    this.height = 60;
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 30;
    this.applyGravity();

    // Nur starten, wenn !landed
    this.rotationInterval = setInterval(() => {
      if (!this.landed) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 80);

    this.movementInterval = setInterval(() => {
      if (!this.landed) {
        this.x += 10;
      }
    }, 25);
  }

  onGroundHit() {
    this.landed = true; // Ab jetzt keine Rotation/Bewegung mehr

    // Y-Position fixieren, falls nötig
    this.y = 360;

    // Rotation & Bewegung stoppen
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);

    // Boden-Animation
    this.currentImage = 0;
    this.breakInterval = setInterval(() => {
      // Nur weiter abspielen, wenn noch nicht entfernt
      if (!this.landed) return;
      this.playAnimation(this.IMAGES_ON_GROUND);
    }, 200);

    // Nach 2 Sek: Boden-Animation beenden & aus Array entfernen
    setTimeout(() => {
      clearInterval(this.breakInterval);
      this.removeBottleFromWorld();
    }, 2000);
  }

  removeBottleFromWorld() {
    let i = this.world.throwableObjects.indexOf(this);
    if (i > -1) {
      this.world.throwableObjects.splice(i, 1);
    }
  }
}