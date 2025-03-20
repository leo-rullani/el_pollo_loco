/**
 * Represents a throwable bottle object. It inherits from MovableObject,
 * can be thrown, rotates in the air, and may splash or break on contact.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths for the bottle's rotation animation.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array of image paths for the bottle lying on the ground (unbroken).
   * @type {string[]}
   */
  IMAGES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Array of image paths for the splash animation (e.g., shattering).
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Indicates whether the bottle has landed (on ground or via splash).
   * @type {boolean}
   */
  landed = false;

  /**
   * Interval ID for the bottle's rotation animation.
   * @type {number|undefined}
   */
  rotationInterval;

  /**
   * Interval ID for the bottle's movement (flying forward).
   * @type {number|undefined}
   */
  movementInterval;

  /**
   * Interval ID for the splash animation.
   * @type {number|undefined}
   */
  splashInterval;

  /**
   * Interval ID for the broken-bottle-on-ground animation.
   * @type {number|undefined}
   */
  breakInterval;

  /**
   * Creates a new ThrowableObject with given start position,
   * loads all relevant images, sets dimensions, and initiates the throw.
   * @param {number} x - The initial x-position of the thrown object.
   * @param {number} y - The initial y-position of the thrown object.
   * @param {World} world - Reference to the game world (for sound, removal, etc.).
   */
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

  /**
   * Throws the bottle by setting its position, vertical speed,
   * and starting rotation & movement intervals.
   * @param {number} x - The starting x-position.
   * @param {number} y - The starting y-position.
   */
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

  /**
   * Triggers the splash animation (e.g., when hitting an enemy).
   * Stops rotation/movement, plays shatter sound, and removes bottle afterwards.
   */
  triggerSplash() {
    this.landed = true;
    this.stopRotationMovement();
    this.playSplashSound();
    this.startSplashAnimation();
  }

  /**
   * Stops the rotation and movement intervals.
   * Used when the bottle lands or splashes.
   */
  stopRotationMovement() {
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);
  }

  /**
   * Plays the bottle shattering sound from the beginning.
   */
  playSplashSound() {
    this.world.bottleShatterSound.currentTime = 0;
    this.world.bottleShatterSound.play();
  }

  /**
   * Starts the splash animation, then removes the bottle from the world.
   */
  startSplashAnimation() {
    this.currentImage = 0;
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 80);

    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.removeBottleFromWorld();
    }, 700);
  }

  /**
   * Called when the bottle hits the ground without splashing on an enemy.
   * Sets the bottle on the ground, stops rotation, and shows a brief "on-ground" animation.
   */
  onGroundHit() {
    this.landed = true;
    this.y = 360;
    this.stopRotationMovement();
    this.currentImage = 0;

    this.breakInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ON_GROUND);
    }, 200);

    setTimeout(() => {
      clearInterval(this.breakInterval);
      this.removeBottleFromWorld();
    }, 300);
  }

  /**
   * Removes this bottle from the world's array of throwable objects.
   */
  removeBottleFromWorld() {
    const i = this.world.throwableObjects.indexOf(this);
    if (i > -1) {
      this.world.throwableObjects.splice(i, 1);
    }
  }
}