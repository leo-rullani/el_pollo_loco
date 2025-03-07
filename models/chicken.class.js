class chicken extends MovableObject {
  y = 370;
  height = 55;
  width = 70;
  speed = 0.15 + Math.random() * 0.5;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  // Neu: Dead-Grafik (nur 1 Bild oder mehrere, je nach Assets)
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500;
    this.animate();
  }

  animate() {
    // Laufen
    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    // Lauf-Animation
    this.walkInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Spielt die Dead-Grafik ab, stoppt Bewegung
   */
  playDeadAnimation() {
    // 1) Stoppe alle Intervalle
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);

    // 2) Zeige das Dead-Bild
    this.currentImage = 0; // index auf 0
    // Optional: kleiner Intervall, falls du nur 1 Frame hast, reicht "setImage" einmal.
    // Aber wir können es so machen:
    this.deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 100);

    // Optional: nach einiger Zeit entfernen wir das Huhn
    // (oder lassen es liegen, je nach Gamedesign).
  }
}