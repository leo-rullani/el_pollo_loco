class StatusBar extends DrawableObject {
    
    
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    percentage = 100;


    constructor() {
        super(); /* Initialisierung des übergeordneten Objekts */
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    // setPercentage(50);
    setPercentage(percentage) {
        this.percentage = percentage; // => 0 … 5
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }


        resolveImageIndex() { 
        if(this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}

class BossStatusBar extends DrawableObject {
    
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/2_statusbar_endboss/blue.png'
    ];
  
    percentage = 100;
  
    constructor() {
      super();
      this.loadImages(this.IMAGES);
      this.x = 480; // z. B. rechts oben
      this.y = 0;
      this.width = 200;
      this.height = 60;
      this.setPercentage(100);
    }
  
    setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.IMAGES[this.resolveImageIndex()];
      this.img = this.imageCache[path];
    }

  
    resolveImageIndex() {
      if (this.percentage == 100) return 5;
      else if (this.percentage > 80) return 4;
      else if (this.percentage > 60) return 3;
      else if (this.percentage > 40) return 2;
      else if (this.percentage > 20) return 1;
      else return 0;
    }
  }  

  class CoinBar extends DrawableObject {
    percentage = 0;
  
    constructor() {
      super();
      // Pfade anpassen! Beispiel:
      this.IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
      ];
      this.loadImages(this.IMAGES);
  
      // Position / Größe anpassen
      this.x = 20;
      this.y = 50;  // etwas unterhalb der Lebensbar
      this.width = 200;
      this.height = 60;
  
      this.setPercentage(0); // Startwert
    }
  
    setPercentage(percentage) {
      this.percentage = percentage;
      let path = this.resolveImageIndex(percentage);
      this.img = this.imageCache[path];
    }
  
    resolveImageIndex(percentage) {
      if (percentage >= 100) {
        return this.IMAGES[5];
      } else if (percentage >= 80) {
        return this.IMAGES[4];
      } else if (percentage >= 60) {
        return this.IMAGES[3];
      } else if (percentage >= 40) {
        return this.IMAGES[2];
      } else if (percentage >= 20) {
        return this.IMAGES[1];
      } else {
        return this.IMAGES[0];
      }
    }
  }   