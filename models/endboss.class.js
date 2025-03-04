class Endboss extends MovableObject {
    IMAGES_WALKING = [
      'img/4_enemie_boss_chicken/2_alert/G5.png',
      'img/4_enemie_boss_chicken/2_alert/G6.png',
      'img/4_enemie_boss_chicken/2_alert/G7.png',
      'img/4_enemie_boss_chicken/2_alert/G8.png',
      'img/4_enemie_boss_chicken/2_alert/G9.png',
      'img/4_enemie_boss_chicken/2_alert/G10.png',
      'img/4_enemie_boss_chicken/2_alert/G11.png',
      'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
  
    constructor() {
      super().loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
      this.x = 700;
      this.animate();
    }
  
    animate() {
      setInterval(() => {
        // Beispiel: Alle 200ms laufe durch die IMAGES_WALKING
        this.playAnimation(this.IMAGES_WALKING);
      }, 200);
    }
  }  