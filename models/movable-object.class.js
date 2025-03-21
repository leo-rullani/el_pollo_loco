/**
 * Represents a movable object that inherits from DrawableObject.
 * It supports gravity, movement, collision checks, and health management.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * Base horizontal speed for movement.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Indicates whether the object is facing left (true) or right (false).
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Vertical speed component, used for jumps or falls.
   * @type {number}
   */
  speedY = 0;

  /**
   * Acceleration used when applying gravity.
   * @type {number}
   */
  acceleration = 2.5;

  /**
   * Current energy or health of the object (0 = dead).
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp of the last hit to manage temporary 'hurt' status.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Interval ID for applying gravity.
   * @type {number|null}
   */
  gravityInterval;

  /**
   * Applies gravity to this object at a fixed interval.
   * If the object is above the ground or moving upward,
   * it continues to move/fall. Otherwise, it stops or triggers onGroundHit().
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
   * Checks if the object is currently above the ground level.
   * Special cases:
   * - ThrowableObject: considered above ground if y < 360.
   * - Endboss: considered above ground if y < 85.
   * @returns {boolean} True if above the ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return this.y < 360;
    if (this instanceof Endboss) return this.y < 85;
    return this.y < 180;
  }

  /**
   * Checks collision with another movable object.
   * @param {MovableObject} mo - The other object to test collision with.
   * @returns {boolean} True if both objects overlap, otherwise false.
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );    
  }

  /**
   * Reduces the object's energy by a given amount of damage.
   * If energy drops below zero, it's set to zero.
   * Updates the lastHit timestamp unless energy is 0.
   * @param {number} [damage=5] - The damage to apply.
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is in a 'hurt' state,
   * which lasts for 1 second after the last hit.
   * @returns {boolean} True if the object is still hurt, otherwise false.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object's energy has dropped to zero.
   * @returns {boolean} True if energy is 0, otherwise false.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Cycles through the given image array to play an animation.
   * @param {string[]} images - The array of image paths for the animation.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Makes the object jump by setting a vertical speed.
   */
  jump() {
    this.speedY = 23;
  }
}