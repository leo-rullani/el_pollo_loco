class Bottle extends MovableObject {
    constructor(x, y) {
      super().loadImage('img/6_salsa_bottle/salsa_bottle.png'); 
      // Pfad anpassen, z. B. "img/6_salsa_bottle/bottle_rotation/1_bottle.png"
      this.x = x;
      this.y = y;
      this.width = 80;   // anpassen, wie du willst
      this.height = 80;
    }
  }  