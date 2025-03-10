class Bottle extends MovableObject {
    constructor(x, y) {
      super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'); 
      // Pfad anpassen, z. B. "img/6_salsa_bottle/bottle_rotation/1_bottle.png"
      this.x = 200 + Math.random() * 2500;
      this.y = 380;
// => z.B. verteilt zwischen y=70 und y=120

  
      this.width = 50;
      this.height = 50;
    }
  }  