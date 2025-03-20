/**
 * Represents the main playable character extending MovableObject.
 * This character can move, jump, idle, and interact with enemies or items.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * The character's height in pixels.
   * @type {number}
   */
  height = 250;

  /**
   * The initial Y-position on the canvas.
   * @type {number}
   */
  y = 95;

  /**
   * The horizontal speed of the character.
   * @type {number}
   */
  speed = 10;

  /**
   * Array of image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Array of image paths for the jumping animation.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Array of image paths for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Array of image paths for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Array of image paths for the short idle animation.
   * @type {string[]}
   */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Array of image paths for the long idle animation.
   * @type {string[]}
   */
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * A reference to the current game world.
   * @type {World}
   */
  world;

  /**
   * Tracks the time (in ms) since the last movement.
   * Used for idle animations.
   * @type {number}
   */
  timeSinceLastMove = 0;

  /**
   * Interval for moving the character.
   * @type {number|undefined}
   */
  moveInterval;

  /**
   * Interval for animating the character.
   * @type {number|undefined}
   */
  animationInterval;

  /**
   * A simple counter to control idle frame skipping.
   * @type {number}
   */
  idleFrameCounter = 0;

  /**
   * Creates a new Character instance, loads images, applies gravity,
   * and starts animation loops.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();

    /**
     * The jump sound effect for the character.
     * @type {HTMLAudioElement}
     */
    this.jumpSound = new Audio("audio/jump.mp3");
  }

  /**
   * Sets up intervals for character movement and animation.
   */
  animate() {
    this.startMoveInterval();
    this.startAnimationInterval();
  }

  /**
   * Starts the interval for checking keyboard input
   * and moves the character accordingly.
   * (Split into smaller helper methods to keep function length <= 14 lines)
   */
  startMoveInterval() {
    this.moveInterval = setInterval(() => {
      let noKey = this.handleHorizontalMovement();
      noKey = this.handleJump(noKey);
      noKey = this.handleThrow(noKey);
      this.handleIdleMovement(noKey);
      this.handleCamera();
    }, 1000 / 60);
  }

  /**
   * Handles horizontal movement (left/right) based on keyboard input.
   * @returns {boolean} - Returns true if no horizontal key was pressed, otherwise false.
   */
  handleHorizontalMovement() {
    let noKey = true;
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      noKey = false;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      noKey = false;
    }
    return noKey;
  }

  /**
   * Checks if jump keys (space/up) are pressed, and triggers a jump if possible.
   * @param {boolean} noKey - Whether no key has been pressed so far.
   * @returns {boolean} - Updated noKey status.
   */
  handleJump(noKey) {
    if (
      (this.world.keyboard.SPACE || this.world.keyboard.UP) &&
      !this.isAboveGround()
    ) {
      this.jump();
      noKey = false;
    }
    return noKey;
  }

  /**
   * Checks if the throw key (D) is pressed.
   * @param {boolean} noKey - Whether no key has been pressed so far.
   * @returns {boolean} - Updated noKey status.
   */
  handleThrow(noKey) {
    if (this.world.keyboard.D) {
      noKey = false;
    }
    return noKey;
  }

  /**
   * Handles idle movement tracking to determine if the character
   * has been inactive, updating the timeSinceLastMove.
   * @param {boolean} noKey - Whether no key has been pressed in this iteration.
   */
  handleIdleMovement(noKey) {
    if (noKey) {
      this.timeSinceLastMove += 1000 / 60;
    } else {
      this.timeSinceLastMove = 0;
    }
  }

  /**
   * Updates the camera position to follow the character.
   */
  handleCamera() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Starts the interval that updates the character's animation frames.
   */
  startAnimationInterval() {
    this.animationInterval = setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        this.playIdleOrWalking();
      }
    }, 50);
  }

  /**
   * Chooses whether to play walking or idle animations,
   * including short or long idle sequences.
   */
  playIdleOrWalking() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.idleFrameCounter = 0;
    } else {
      let t = this.timeSinceLastMove;
      if (t > 10000) {
        this.playIdleAnimationSlow(this.IMAGES_LONG_IDLE, 5);
      } else if (t > 5000) {
        this.playIdleAnimationSlow(this.IMAGES_IDLE, 4);
      } else {
        this.playIdleAnimationSlow(this.IMAGES_IDLE, 3);
      }
    }
  }

  /**
   * Plays an idle animation at a slower rate by skipping frames.
   * @param {string[]} images - The array of images for the animation.
   * @param {number} skipFrames - How many frames to skip before showing the next image.
   */
  playIdleAnimationSlow(images, skipFrames) {
    this.idleFrameCounter++;
    if (this.idleFrameCounter >= skipFrames) {
      this.idleFrameCounter = 0;
      this.playAnimation(images);
    }
  }

  /**
   * Makes the character jump if it's not already above the ground.
   * Resets and plays the jump sound each time.
   */
  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 23;
      this.world.jumpSound.currentTime = 0;
      this.world.jumpSound.play();
    }
  }
}
