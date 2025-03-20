/**
 * Represents a level configuration in the game, defining all enemies,
 * clouds, coins, bottles, background objects, and the level's endpoint.
 */
class Level {
    /**
     * A collection of enemy objects (e.g., chickens, endboss).
     * @type {MovableObject[]}
     */
    enemies;
  
    /**
     * A collection of cloud objects for the background.
     * @type {cloud[]}
     */
    clouds;
  
    /**
     * A collection of coin objects placed throughout the level.
     * @type {Coin[]}
     */
    coins;
  
    /**
     * A collection of background objects to create the level scenery.
     * @type {BackgroundObject[]}
     */
    backgroundObjects;
  
    /**
     * A collection of bottle objects scattered in the level.
     * @type {Bottle[]}
     */
    bottles;
  
    /**
     * The X-coordinate at which the level ends.
     * @type {number}
     */
    level_end_x;
  
    /**
     * Creates a new Level instance, assigning all entities and the boundary.
     *
     * @param {MovableObject[]} enemies - The array of enemy objects.
     * @param {cloud[]} clouds - The array of cloud objects.
     * @param {Coin[]} coins - The array of coins.
     * @param {Bottle[]} bottles - The array of bottles.
     * @param {BackgroundObject[]} backgroundObjects - The array of background objects.
     * @param {number} [level_end_x=5000] - The X-position where this level ends.
     */
    constructor(enemies, clouds, coins, bottles, backgroundObjects, level_end_x = 5000) {
      this.enemies = enemies;
      this.clouds = clouds;
      this.coins = coins;
      this.bottles = bottles;
      this.backgroundObjects = backgroundObjects;
      this.level_end_x = level_end_x;
    }
  }  