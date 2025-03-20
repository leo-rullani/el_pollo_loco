/**
 * Represents the end boss enemy in the game, extending MovableObject.
 * The end boss can walk, alert, attack, get hurt, and eventually die/fall.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * The damage the end boss deals to the character.
   * @type {number}
   */
  damage = 50;

  /**
   * The height of the end boss in pixels.
   * @type {number}
   */
  height = 400;

  /**
   * The width of the end boss in pixels.
   * @type {number}
   */
  width = 250;

  /**
   * The y-position of the end boss on the canvas.
   * @type {number}
   */
  y = 55;

  /**
   * The x-position of the end boss on the canvas.
   * @type {number}
   */
  x = 5000;

  /**
   * Represents the boss's health state (number of hits it can take).
   * @type {number}
   */
  energy = 5;

  /**
   * Interval ID for movement logic.
   * @type {number|null}
   */
  moveInterval;

  /**
   * Interval ID for animation logic (walk, alert, attack, hurt).
   * @type {number|null}
   */
  animationInterval;

  /**
   * Interval ID for the dead animation loop.
   * @type {number|null}
   */
  deadInterval;

  /**
   * Interval ID for the sinking animation after the boss dies.
   * @type {number|null}
   */
  sinkInterval;

  /**
   * Interval ID for applying gravity after the boss is dead.
   * @type {number|null}
   */
  gravityInterval;

  /**
   * Array of image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Array of image paths for the alert animation.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Array of image paths for the attack animation.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * Array of image paths for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Array of image paths for the dead animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates a new Endboss instance, loads its images, and starts animation/movement.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadAllImages();
    this.x = 2500;
    this.speed = 0.2 + Math.random() * 0.9;
    this.animate();
  }

  /**
   * Loads all image arrays (walk, alert, attack, hurt, dead) into the image cache.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Sets up intervals for movement (moving left) and animation (e.g. walk, attack).
   */
  animate() {
    this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else if (this.isAlert) {
        this.playAnimation(this.IMAGES_ALERT);
      } else {
        this.playAnimation(this.IMAGES_WALK);
      }
    }, 200);
  }

  /**
   * Plays the death animation by clearing intervals and initiating a fall sequence.
   */
  playDeadAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    this.speedY = 0;
    this.currentImage = 0;
    setTimeout(() => {
      this.fallToGround();
    }, 300);
  }

  /**
   * Applies gravity to make the end boss fall, then stops gravity
   * and starts the dead animation loop.
   */
  fallToGround() {
    this.applyGravity();
    setTimeout(() => {
      clearInterval(this.gravityInterval);
      this.y = 80;
      this.startDeadAnimationLoop();
    }, 1000);
  }

  /**
   * Continuously plays the dead animation; once it finishes, the boss starts sinking.
   */
  startDeadAnimationLoop() {
    this.deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        this.endDeadAnimation();
      }
    }, 100);
  }

  /**
   * Ends the dead animation loop and triggers the sinking motion of the boss.
   */
  endDeadAnimation() {
    clearInterval(this.deadInterval);
    this.currentImage = this.IMAGES_DEAD.length - 1;
    setTimeout(() => {
      this.sinkBoss();
    }, 800);
  }

  /**
   * Moves the dead boss downward (sinking) and stops after a fixed time.
   */
  sinkBoss() {
    this.sinkInterval = setInterval(() => {
      this.y += 5;
    }, 100);

    setTimeout(() => {
      clearInterval(this.sinkInterval);
    }, 1500);
  }

  /**
   * Stops any active intervals (movement, walking, or dead animation).
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
   * Resumes the regular boss animation and movement after being stopped.
   */
  resumeIntervals() {
    this.animate();
  }
}