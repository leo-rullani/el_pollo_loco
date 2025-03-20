/**
 * Represents a collectible coin within the game, extending MovableObject.
 * Its position is randomly generated along the x-axis and within a certain y range.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /**
   * Creates a new Coin instance with random position and fixed dimensions.
   */
  constructor() {
    super().loadImage("img/8_coin/coin_1.png");

    /**
     * The X-position of the coin.
     * Randomly placed between 200 and 4700.
     * @type {number}
     */
    this.x = 200 + Math.random() * 4500;

    /**
     * The Y-position of the coin.
     * Randomly placed between 140 and 190.
     * @type {number}
     */
    this.y = 190 - Math.random() * 50;

    /**
     * The width of the coin in pixels.
     * @type {number}
     */
    this.width = 100;

    /**
     * The height of the coin in pixels.
     * @type {number}
     */
    this.height = 100;
  }
}