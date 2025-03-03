class cloud extends MovableObject {
  /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */
  y = 20;
  width = 500;
  height = 250; /* diese Variablen müssen nicht dynamisch sein, daher nicht im Konstruktor */
  speed = 0.15

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x =
      0 +
      Math.random() *
        500; /* Chicken wird auf auf der x-Achse beliebig/zufällig rechts positioniert */
    this.animate();
  }

  animate(){
    this.moveLeft();
  }

  moveLeft(){
    setInterval(() => {
        this.x -= this.speed;
    }, 1000/60);
    }
  }