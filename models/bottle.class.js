/**
 * Represents a bottle object that inherits from MovableObject.
 * This bottle can be picked up or thrown by the character.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
  /**
   * Creates a new instance of Bottle.
   * Loads the salsa bottle image and sets its default position and size.
   *
   * @param {number} x - The initial X-position (currently unused).
   * @param {number} y - The initial Y-position (currently unused).
   */
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'); 
    
    /**
     * The X-position of the bottle.
     * A random offset is added to 200, up to 2500.
     * @type {number}
     */
    this.x = 200 + Math.random() * 2500;

    /**
     * The Y-position of the bottle.
     * @type {number}
     */
    this.y = 380;

    /**
     * The width of the bottle.
     * @type {number}
     */
    this.width = 50;

    /**
     * The height of the bottle.
     * @type {number}
     */
    this.height = 50;
  }
}