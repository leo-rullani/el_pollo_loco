/**
 * Represents a background object that inherits from MovableObject.
 * These objects serve as background images within the game.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    /**
     * The width of the background object.
     * @type {number}
     */
    width = 720;

    /**
     * The height of the background object.
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new instance of BackgroundObject.
     * Loads the specified image and positions the object on the canvas.
     *
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The X-position of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}