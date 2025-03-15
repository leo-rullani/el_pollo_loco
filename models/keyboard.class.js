class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;
  
    constructor() {
      this.bindKeyboardEvents();
      this.bindMobileButtons();
    }
  
    bindKeyboardEvents() {
      // Keydown
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 37) this.LEFT = true;
        if (e.keyCode === 39) this.RIGHT = true;
        if (e.keyCode === 38) this.UP = true;
        if (e.keyCode === 40) this.DOWN = true;
        if (e.keyCode === 32) this.SPACE = true;
        if (e.keyCode === 68) this.D = true;
      });
  
      // Keyup
      window.addEventListener('keyup', (e) => {
        if (e.keyCode === 37) this.LEFT = false;
        if (e.keyCode === 39) this.RIGHT = false;
        if (e.keyCode === 38) this.UP = false;
        if (e.keyCode === 40) this.DOWN = false;
        if (e.keyCode === 32) this.SPACE = false;
        if (e.keyCode === 68) this.D = false;
      });
    }
  
    bindMobileButtons() {
      // Hol dir die Elemente
      let btnLeft = document.getElementById('mobile-left');
      let btnRight = document.getElementById('mobile-right');
      let btnJump = document.getElementById('mobile-jump');
      let btnThrow = document.getElementById('mobile-throw');
  
      if (btnLeft) {
        btnLeft.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.LEFT = true;
        });
        btnLeft.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.LEFT = false;
        });
      }
  
      if (btnRight) {
        btnRight.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.RIGHT = true;
        });
        btnRight.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.RIGHT = false;
        });
      }
  
      if (btnJump) {
        btnJump.addEventListener('touchstart', (e) => {
          e.preventDefault();
          // => Entweder this.UP = true, oder this.SPACE = true
          this.UP = true;
        });
        btnJump.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.UP = false;
        });
      }
  
      if (btnThrow) {
        btnThrow.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.D = true;
        });
        btnThrow.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.D = false;
        });
      }
    }
  }
  