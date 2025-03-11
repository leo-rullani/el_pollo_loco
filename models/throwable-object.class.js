class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

  // Flag, um eindeutig festzustellen, ob die Flasche schon gelandet ist
  landed = false;

  constructor(x, y, world) {
    // Startbild
    super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_ON_GROUND);
    this.loadImages(this.IMAGES_SPLASH);

    // Welt-Referenz, um die Flasche später zu entfernen
    this.world = world;

    // Größe
    this.width = 50;
    this.height = 60;

    // Startet direkt den Wurf
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    // Anfangs nach oben
    this.speedY = 30;

    // Schwerkraft aktiv
    this.applyGravity();

    // **Rotation-Interval**: Alle 80ms ein Bild aus IMAGES_ROTATION
    this.rotationInterval = setInterval(() => {
      // Wichtig: Falls gelandet, NICHT mehr rotieren
      if (!this.landed) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 80);

    // **Bewegungs-Interval**: Alle 25ms x um 10 px nach rechts
    this.movementInterval = setInterval(() => {
      if (!this.landed) {
        this.x += 10;
      }
    }, 25);
  }

  triggerSplash() {
    // 1) Verhindere weitere Bewegungen/Rotationen
    this.landed = true;  // Reicht als Flag aus, um Movement/Rotation zu stoppen
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);
  
    // 2) Splash-Sound
    let splashSound = new Audio('audio/bottle-shattering.mp3');
    splashSound.play();
  
    // 3) Animation anstoßen
    this.currentImage = 0; // Reset der Animations-Zählung
    this.splashInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);
    }, 80);
  
    // 4) Nach kurzer Zeit (z.B. 500ms) alle Intervalle beenden und Flasche entfernen
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.removeBottleFromWorld();  // löscht das Objekt aus world.throwableObjects
    }, 700);
  } 

  /**
   * Wird aufgerufen, wenn das Objekt nicht mehr "isAboveGround()" ist.
   * (siehe applyGravity in MovableObject)
   */
  onGroundHit() {
    // Verhindert jegliche weitere Bewegung/Rotation
    this.landed = true;

    // Endgültige y-Position. Passen, wenn Boden = 360
    this.y = 360;

    // Bestehende Rotation und Bewegung stoppen
    clearInterval(this.rotationInterval);
    clearInterval(this.movementInterval);

    // Animation am Boden starten
    this.currentImage = 0; // Reset des Animations-Counters
    this.breakInterval = setInterval(() => {
      // Nur weiter animieren, solange landed true ist
      this.playAnimation(this.IMAGES_ON_GROUND);
    }, 200);

    // Nach 2 Sekunden verschwindet die Flasche
    setTimeout(() => {
      clearInterval(this.breakInterval);
      this.removeBottleFromWorld();
    }, 300);
  }

  /**
   * Entfernt die Flasche aus world.throwableObjects
   */
  removeBottleFromWorld() {
    let i = this.world.throwableObjects.indexOf(this);
    if (i > -1) {
      this.world.throwableObjects.splice(i, 1);
    }
  }
}