/**
 * A status bar to display the player's health status in various color stages.
 * @extends DrawableObject
*/
class StatusBar extends DrawableObject {
  /**
   * An array of image paths representing different health levels (0–100%).
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * Current health percentage (0–100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new StatusBar instance, loads its images,
   * and sets initial position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the health bar to reflect the given percentage.
   * @param {number} percentage - The current health percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines which image index should be shown based on the current percentage.
   * @returns {number} The index of the image in the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}

/*
 * A special status bar for the end boss, showing its health in different stages.
 * @extends DrawableObject
*/
class BossStatusBar extends DrawableObject {
  /**
   * An array of image paths representing the boss's health levels (0–100%).
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/2_statusbar_endboss/blue.png",
  ];

  /**
   * Current boss health percentage (0–100).
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new BossStatusBar instance, loads its images,
   * and sets the position and size on the screen.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 470;
    this.y = 50;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the boss health bar to reflect the given percentage.
   * @param {number} percentage - The current health percentage of the boss.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines which image index should be shown based on the current percentage.
   * @returns {number} The index of the image in the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}

/*
 * A status bar to display the player's collected coins.
 * @extends DrawableObject
*/
class CoinBar extends DrawableObject {
  /**
   * Current coin collection percentage (0–100).
   * @type {number}
   */
  percentage = 0;

  /**
   * Initializes the CoinBar with corresponding images and sets default position.
   */
  constructor() {
    super();
    this.IMAGES = [
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ];
    this.loadImages(this.IMAGES);

    this.x = 30;
    this.y = 50;
    this.width = 200;
    this.height = 60;

    this.setPercentage(0);
  }

  /**
   * Updates the coin bar to reflect the given percentage.
   * @param {number} percentage - The current coin collection percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.resolveImageIndex(percentage);
    this.img = this.imageCache[path];
  }

  /**
   * Determines which image path should be displayed based on the coin percentage.
   * @param {number} percentage - The current coin collection percentage.
   * @returns {string} The path to the appropriate coin bar image.
   */
  resolveImageIndex(percentage) {
    if (percentage >= 100) {
      return this.IMAGES[5];
    } else if (percentage >= 80) {
      return this.IMAGES[4];
    } else if (percentage >= 60) {
      return this.IMAGES[3];
    } else if (percentage >= 40) {
      return this.IMAGES[2];
    } else if (percentage >= 20) {
      return this.IMAGES[1];
    } else {
      return this.IMAGES[0];
    }
  }
}

/*
 * A status bar to display the player's collected bottles.
 * @extends DrawableObject
*/
class BottleBar extends DrawableObject {
  /**
   * Current bottle collection percentage (0–100).
   * @type {number}
   */
  percentage = 0;

  /**
   * Initializes the BottleBar with corresponding images and sets default position.
   */
  constructor() {
    super();
    this.IMAGES = [
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
    ];
    this.loadImages(this.IMAGES);

    this.x = 30;
    this.y = 100;
    this.width = 200;
    this.height = 60;

    this.setPercentage(0);
  }

  /**
   * Updates the bottle bar to reflect the given percentage.
   * @param {number} percentage - The current bottle collection percentage.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.resolveImageIndex(percentage);
    this.img = this.imageCache[path];
  }

  /**
   * Determines which image path should be displayed based on the bottle percentage.
   * @param {number} percentage - The current bottle collection percentage.
   * @returns {string} The path to the appropriate bottle bar image.
   */
  resolveImageIndex(percentage) {
    if (percentage >= 100) {
      return this.IMAGES[5];
    } else if (percentage >= 80) {
      return this.IMAGES[4];
    } else if (percentage >= 60) {
      return this.IMAGES[3];
    } else if (percentage >= 40) {
      return this.IMAGES[2];
    } else if (percentage >= 20) {
      return this.IMAGES[1];
    } else {
      return this.IMAGES[0];
    }
  }
}