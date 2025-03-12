class Endboss extends MovableObject {
  damage = 10;
  height = 400;
  width = 250;
  y = 55;
  x = 2200;
  energy = 5;
  moveInterval;
  animationInterval;
  deadInterval;

  IMAGES_WALK = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadAllImages();
    this.x = 2500;
    this.speed = 0.2 + Math.random() * 0.9;
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  animate() {
    this.moveInterval = setInterval(() => this.moveLeft(), 1000 / 60);
    this.animationInterval = setInterval(() => {
      if (this.isDead()) this.playAnimation(this.IMAGES_DEAD);
      else if (this.isHurt()) this.playAnimation(this.IMAGES_HURT);
      else if (this.isAttacking) this.playAnimation(this.IMAGES_ATTACK);
      else if (this.isAlert) this.playAnimation(this.IMAGES_ALERT);
      else this.playAnimation(this.IMAGES_WALK);
    }, 200);
  }

  playDeadAnimation() {
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
    this.speedY = 0;
    this.currentImage = 0;
    setTimeout(() => {
      this.fallToGround();
    }, 300);
  }

  fallToGround() {
    // Reaktiviere Gravitation, damit Boss "runterfällt"
    this.applyGravity();
    setTimeout(() => {
      clearInterval(this.gravityInterval);
      this.y = 80; // Force: Landet genau auf Boden
      this.startDeadAnimationLoop();
    }, 1000);
  }

  startDeadAnimationLoop() {
    this.deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        this.endDeadAnimation();
      }
    }, 100);
  }

  endDeadAnimation() {
    clearInterval(this.deadInterval);
    this.currentImage = this.IMAGES_DEAD.length - 1;
    setTimeout(() => {
      this.sinkBoss();
    }, 800);
  }

  sinkBoss() {
    let sinkInterval = setInterval(() => {
      this.y += 5;
    }, 100);
    setTimeout(() => {
      clearInterval(sinkInterval);
      // Entferne Boss aus Array oder trigger "You Win"
      // z.B. world.removeBoss(this);
    }, 1500);
  }
}