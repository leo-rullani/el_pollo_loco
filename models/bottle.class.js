class Bottle extends MovableObject {
    constructor(x, y) {
      super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'); 
      this.x = 200 + Math.random() * 2500;
      this.y = 380;
      this.width = 50;
      this.height = 50;
    }
  }  