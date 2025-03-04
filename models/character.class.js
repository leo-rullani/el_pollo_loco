class Character extends MovableObject {
  /* Character hat mit "extends" nun alle Eigenschaften, die MovableObject auch hat */

  height = 280;
  y = 155;
  speed = 15;
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
    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      this.world.camera_x = -this.x + 100; /* Pepe läuft immer 100px vom linken Rand entfernt */
    }, 1000 / 60);

    /* Aus dem imageCache wird das Bild geladen und diese Bilder zu dem aktuellen Bild gesetzt */
    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        /* walk animation */
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 50); /* Animation: Bild wird alle 100ms gewechselt damit es flüssig aussieht */
  }

  jump() {}
}
