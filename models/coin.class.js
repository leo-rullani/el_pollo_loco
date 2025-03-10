class Coin extends MovableObject {
    constructor(x, y) {
      super().loadImage('img/8_coin/coin_1.png');
      this.x = x;
      this.y = y;
      this.width = 100;
      this.height = 100;
    }
  }  