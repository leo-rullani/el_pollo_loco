/**
 * Manages all keyboard and touch inputs for controlling the character.
 * Provides properties for each key or button (LEFT, RIGHT, UP, etc.)
 * and updates these properties based on user interaction.
 */
class Keyboard {
  /**
   * Whether the left key (or button) is pressed.
   * @type {boolean}
   */
  LEFT = false;

  /**
   * Whether the right key (or button) is pressed.
   * @type {boolean}
   */
  RIGHT = false;

  /**
   * Whether the up key (or button) is pressed.
   * @type {boolean}
   */
  UP = false;

  /**
   * Whether the down key (or button) is pressed.
   * @type {boolean}
   */
  DOWN = false;

  /**
   * Whether the space key is pressed.
   * @type {boolean}
   */
  SPACE = false;

  /**
   * Whether the 'D' key (for throwing) is pressed.
   * @type {boolean}
   */
  D = false;

  /**
   * Initializes event listeners for both keyboard and mobile buttons.
   */
  constructor() {
    this.bindKeyboardEvents();
    this.bindMobileButtons();
  }

  /**
   * Binds event listeners for keydown and keyup to manage the corresponding flags.
   */
  bindKeyboardEvents() {
    // Keydown
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 37) this.LEFT = true;
      if (e.keyCode === 39) this.RIGHT = true;
      if (e.keyCode === 38) this.UP = true;
      if (e.keyCode === 40) this.DOWN = true;
      if (e.keyCode === 32) this.SPACE = true;
      if (e.keyCode === 68) this.D = true;
    });

    // Keyup
    window.addEventListener("keyup", (e) => {
      if (e.keyCode === 37) this.LEFT = false;
      if (e.keyCode === 39) this.RIGHT = false;
      if (e.keyCode === 38) this.UP = false;
      if (e.keyCode === 40) this.DOWN = false;
      if (e.keyCode === 32) this.SPACE = false;
      if (e.keyCode === 68) this.D = false;
    });
  }

  /**
   * Binds touchstart and touchend events to mobile buttons for movement and actions.
   * This ensures touch devices can control the character similarly to a keyboard.
   */
  bindMobileButtons() {
    let btnLeft = document.getElementById("mobile-left");
    let btnRight = document.getElementById("mobile-right");
    let btnJump = document.getElementById("mobile-jump");
    let btnThrow = document.getElementById("mobile-throw");

    if (btnLeft) {
      btnLeft.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.LEFT = true;
      });
      btnLeft.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.LEFT = false;
      });
    }

    if (btnRight) {
      btnRight.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.RIGHT = true;
      });
      btnRight.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.RIGHT = false;
      });
    }

    if (btnJump) {
      btnJump.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.UP = true;
      });
      btnJump.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.UP = false;
      });
    }

    if (btnThrow) {
      btnThrow.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.D = true;
      });
      btnThrow.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.D = false;
      });
    }
  }
}