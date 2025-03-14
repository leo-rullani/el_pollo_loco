class Character extends MovableObject {
  // Grundwerte
  height = 250;
  y = 95;
  speed = 10;

  // Lauf-Animationen (bereits bekannt)
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  // Sprung-Animationen
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  // Tot-Animationen
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  // Verletzungs-Animationen
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  // Idle / Long-Idle (Platzhalter – bitte richtige Pfade eintragen!)
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png"
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png"
  ];

  // Referenz auf die Welt, Zeitmesser
  world;
  timeSinceLastMove = 0; // in ms (oder in "Frames", je nach Zählweise)

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");

    // Alle Bild-Arrays laden
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);

    this.applyGravity();
    this.animate();
    this.jumpSound = new Audio('audio/jump.mp3');
  }

  // Zusätzliche Variable zum „Verlangsamen“ der Idle-Animation
  idleFrameCounter = 0;

  animate() {
    // 1) Bewegung & Kamera (unverändert)
    setInterval(() => {
      let noKeyPressed = true;
      if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.moveRight();
        this.otherDirection = false;
        noKeyPressed = false;
      }
      if (this.world.keyboard.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        noKeyPressed = false;
      }
      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
        noKeyPressed = false;
      }
      if (this.world.keyboard.D) {
        noKeyPressed = false;
      }      

      if (noKeyPressed) {
        this.timeSinceLastMove += 1000 / 60;
      } else {
        this.timeSinceLastMove = 0;
      }

      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    // 2) Animationen (Bilder wechseln)
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        // => auf dem Boden => Idle oder Laufen
        this.playIdleOrWalking();
      }
    }, 50);
  }

  playIdleOrWalking() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      // Laufen => Normale Animation (alle 50ms)
      this.playAnimation(this.IMAGES_WALKING);
      // Reset für Idle-Frame-Zähler
      this.idleFrameCounter = 0;
    } else {
      // => Idle- / Long-Idle-Phase
      let t = this.timeSinceLastMove;

      if (t > 10000) {
        // Long Idle, alle 5 Frames (Beispiel)
        this.playIdleAnimationSlow(this.IMAGES_LONG_IDLE, 5);
      } else if (t > 5000) {
        // Idle, alle 4 Frames
        this.playIdleAnimationSlow(this.IMAGES_IDLE, 4);
      } else {
        // Weniger als 5s => auch Idle, aber evtl. etwas schneller (alle 3 Frames)
        this.playIdleAnimationSlow(this.IMAGES_IDLE, 3);
      }
    }
  }
  playIdleAnimationSlow(images, skipFrames) {
    this.idleFrameCounter++;
    if (this.idleFrameCounter >= skipFrames) {
      this.idleFrameCounter = 0;
      this.playAnimation(images);
    }
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 23;
      if (!this.sfxMuted) {
        this.jumpSound.play();
        console.log('');
      }
    }
  }
}