class Coin extends MovableObject {
    constructor() {
      super().loadImage('img/8_coin/coin_1.png');
      
      // In der Coin-Klasse oder dort, wo du 'x' und 'y' randomisierst:
      this.x = 200 + Math.random() * 2500;
      this.y = 120 - Math.random() * 50; 
// => z.B. verteilt zwischen y=70 und y=120

  
      this.width = 100;
      this.height = 100;
    }
  }  