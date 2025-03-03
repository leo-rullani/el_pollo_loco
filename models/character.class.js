class Character extends MovableObject {
  /* Character hat mit "extends" nun alle Eigenschaften, die MovableObject auch hat */

  height = 280;
  y = 155;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    /* Aus dem imageCache wird das Bild geladen und diese Bilder zu dem aktuellen Bild gesetzt */
    setInterval(() => {
      if (this.world.keyboard.RIGHT) {
        let i = this.currentImage % this.IMAGES_WALKING.length; /* % = Rest, let i = 0 % = 6; % bedeutet 0/6 => 0 Rest 0 bsp. mit 5: 5/6 = 0 Rest 5, bsp. 6/6 = 1, Rest 0, 7/6 = 1, Rest 1*/
        /* i = 0,1,2,3,4,5,6 und dann wieder 0 */
        let path = this.IMAGES_WALKING[i]; /* % holt sich immer wieder das Bild nun, das ganze stürzt nie mehr ab  */
        this.img = this.imageCache[path];
        this.currentImage++; /* currentImage wird auf + erhöht */
      }
    }, 100); /* Animation: Bild wird alle 100ms gewechselt damit es flüssig aussieht */
  }

  jump() {}
}