class SmallChicken extends MovableObject {
  damage = 5;
  y = 390;
  width = 40;
  height = 35;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  moveInterval;
  walkInterval;
  deadInterval;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 5000;
    this.speed = 0.3 + Math.random() * 0.6 ;
    this.animate(); 
  }

  animate() {
    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    this.walkInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  playDeadAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);

    this.currentImage = 0;
    this.deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 10);
  }

  stopIntervals() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    if (this.walkInterval) {
      clearInterval(this.walkInterval);
      this.walkInterval = null;
    }
    if (this.deadInterval) {
      clearInterval(this.deadInterval);
      this.deadInterval = null;
    }
  }

  resumeIntervals() {
    this.animate();
  }  

}
