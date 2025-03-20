/*
 * Represents a drawable object that can be placed on the canvas.
 * It handles loading images, storing them in a cache, and drawing them on the canvas.
 */
class DrawableObject {
  /**
   * Holds the currently loaded image.
   * @type {HTMLImageElement|undefined}
   */
  img;

  /**
   * A cache (dictionary) for storing multiple images, indexed by their file paths.
   * @type {Object<string, HTMLImageElement>}
   */
  imageCache = {};

  /**
   * The index of the currently displayed image from the image cache.
   * @type {number}
   */
  currentImage = 0;

  /**
   * The X-position on the canvas.
   * @type {number}
   */
  x = 120;

  /**
   * The Y-position on the canvas.
   * @type {number}
   */
  y = 280;

  /**
   * The height of the drawable object in pixels.
   * @type {number}
   */
  height = 150;

  /**
   * The width of the drawable object in pixels.
   * @type {number}
   */
  width = 100;

  /**
   * Loads an image from the given path into this object's `img` property.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image on the canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a frame (bounding box) around the object for debugging purposes.
   * Currently commented out to disable the frame display.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    // // Uncomment to display the bounding box of the character/chicken/endboss:
    // if (this instanceof Character || this instanceof chicken || this instanceof Endboss) {
    //   ctx.beginPath();
    //   ctx.lineWidth = "5";
    //   ctx.strokeStyle = "blue";
    //   ctx.rect(this.x, this.y, this.width, this.height);
    //   ctx.stroke();
    // }
  }

  /**
   * Loads multiple images (by file path) into this object's image cache.
   * @param {string[]} arr - An array of image file paths to load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}