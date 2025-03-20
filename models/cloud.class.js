/**
 * Represents a cloud in the game world, extending MovableObject.
 * Clouds are placed in the background and slowly move left.
 * @extends MovableObject
 */
class cloud extends MovableObject {
  /**
   * The Y-position of the cloud.
   * @type {number}
   */
  y = 20;

  /**
   * The width of the cloud image.
   * @type {number}
   */
  width = 500;

  /**
   * The height of the cloud image.
   * @type {number}
   */
  height = 250;

  /**
   * The horizontal speed at which the cloud moves to the left.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Creates a new cloud instance, loads its image,
   * positions it randomly on the X-axis, and starts its movement.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = 0 + Math.random() * 5000;
    this.animate();
  }

  /**
   * Triggers the movement of the cloud.
   */
  animate() {
    this.moveLeft();
  }

  /**
   * Moves the cloud to the left at the defined speed.
   * Uses setInterval to update the position continuously.
   */
  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}