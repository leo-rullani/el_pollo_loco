class chicken extends MovableObject {
  damage = 10; 
  y = 370;
  height = 55;
  width = 70;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
  ]; 

  moveInterval;
  walkInterval;
  deadInterval;
 
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 5000 ;
    this.speed = 0.2 + Math.random() * 0.5;
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
    clearInterval(this.moveInterval);
    clearInterval(this.walkInterval);
    clearInterval(this.deadInterval);
  }
}