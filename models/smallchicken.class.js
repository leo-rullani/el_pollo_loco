/**
 * Represents a smaller chicken enemy in the game, extending MovableObject.
 * This chicken has lower damage, reduced size, and unique animations.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /**
   * The amount of damage this small chicken inflicts on the character.
   * @type {number}
   */
  damage = 5;

  /**
   * The Y-position of the small chicken on the canvas.
   * @type {number}
   */
  y = 390;

  /**
   * The width of the small chicken in pixels.
   * @type {number}
   */
  width = 40;

  /**
   * The height of the small chicken in pixels.
   * @type {number}
   */
  height = 35;

  /**
   * Array of image paths for the small chicken's walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * Array of image paths for the small chicken's dead animation.
   * @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Interval ID for movement.
   * @type {number|null}
   */
  moveInterval;

  /**
   * Interval ID for walking animation.
   * @type {number|null}
   */
  walkInterval;

  /**
   * Interval ID for dead animation.
   * @type {number|null}
   */
  deadInterval;

  /**
   * Creates a new SmallChicken instance, loads its images,
   * sets a random position and speed, and starts its animation.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 5000;
    this.speed = 0.3 + Math.random() * 0.6;

    this.animate();
  }

  /**
   * Starts intervals for movement (moving left) and animation (walking).
   */
  animate() {
    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    this.walkInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Plays the dead animation by clearing existing intervals and repeatedly
   * showing the dead image at a fast interval.
   */
  playDeadAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);

    this.currentImage = 0;
    this.deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 10);
  }

  /**
   * Stops all active intervals (movement, walking, dead).
   */
  stopIntervals() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
    if (this.deadInterval) {
      clearInterval(this.deadInterval);
      this.deadInterval = null;
    }
  }

  /**
   * Resumes walking and moving animations after they were stopped.
   */
  resumeIntervals() {
    this.animate();
  }
}