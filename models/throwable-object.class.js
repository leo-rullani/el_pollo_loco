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

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  landed = false;

  constructor(x, y, world) {
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_ON_GROUND);
    this.loadImages(this.IMAGES_SPLASH);
    this.world = world;
    this.width = 50;
    this.height = 60;
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 30;
    this.applyGravity();
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

  triggerSplash() {
    this.landed = true; 
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);
    let splashSound = new Audio('audio/bottle-shattering.mp3');
    splashSound.play();
    this.currentImage = 0;
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 80);
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.removeBottleFromWorld(); 
    }, 700);
  } 

  onGroundHit() {
    this.landed = true;
    this.y = 360;
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);
    this.currentImage = 0; 
    this.breakInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ON_GROUND);
    }, 200);
    setTimeout(() => {
      clearInterval(this.breakInterval);
      this.removeBottleFromWorld();
    }, 300);
  }

  removeBottleFromWorld() {
    let i = this.world.throwableObjects.indexOf(this);
    if (i > -1) {
      this.world.throwableObjects.splice(i, 1);
    }
  }
}