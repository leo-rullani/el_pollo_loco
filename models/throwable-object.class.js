class ThrowableObject extends MovableObject {

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.height = 60;
        this.width = 50;
        // hier das throw gleich mitgeben
        this.throw(x, y); 
      }
      
      throw(x, y) {
        this.x = x; 
        this.y = y;
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
          this.x += 10;
        }, 25);
      }
    }      