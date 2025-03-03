class chicken extends MovableObject {
  /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */

  y = 360;
  height = 55;
  width = 70;
  IMAGES_WALKING = [ 
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);

    this.x = 200 + Math.random() * 500; /* Chicken wird auf auf der x-Achse beliebig/zufällig rechts positioniert */
    this.animate();
    this.speed = 0.15 + Math.random() * 0.5; /* Chicken haben unterschiedliche Gewschindigkeit, manche laufen schneller, manche langsamer */
  }

  animate() {
    this.moveLeft();
    /* Aus dem imageCache wird das Bild geladen und diese Bilder zu dem aktuellen Bild gesetzt */
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length; /* % = Rest, let i = 0 % = 6; % bedeutet 0/6 => 0 Rest 0 bsp. mit 5: 5/6 = 0 Rest 5, bsp. 6/6 = 1, Rest 0, 7/6 = 1, Rest 1*/
      /* i = 0,1,2,3,4,5,6 und dann wieder 0 */
      let path = this.IMAGES_WALKING[i]; /* % holt sich immer wieder das Bild nun, das ganze stürzt nie mehr ab  */
      this.img = this.imageCache[path];
      this.currentImage++; /* currentImage wird auf + erhöht */
    }, 200); /* Animation: Bild wird alle 100ms gewechselt damit es flüssig aussieht */
  }
}