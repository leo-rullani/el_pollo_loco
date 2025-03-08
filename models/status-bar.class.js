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
        this.x = 0;
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
      "img/7_statusbars/2_statusbar_endboss/blue.png",
      "img/7_statusbars/2_statusbar_endboss/blue.png",
      "img/7_statusbars/2_statusbar_endboss/blue.png",
      "img/7_statusbars/2_statusbar_endboss/blue.png",
      "img/7_statusbars/2_statusbar_endboss/blue.png",
      "img/7_statusbars/2_statusbar_endboss/blue.png"
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