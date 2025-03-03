class World {
  character =
    new Character(); /* Variable definiert und der ein Objekt zugewiesen */
  enemies = [new chicken(), new chicken(), new chicken()];
  clouds = [new cloud()];
  backgroundObjects = [
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

  ];
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(
      /* diese Zeile löscht ganz am Anfang alles auf dem Bildschirm -> schwarzer Hintergrund, ehe die nachfolgenden Objects innert Milisekunden erscheinen 60FPS für uns nicht ersichtlich, da es sehr schnell geht */
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ); /* immer ganz zu Beginn unserer draw()-Methode aufrufen */
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);

    this.ctx.translate(-this.camera_x, 0);

    /* sobald alles darüber ausgeführt ist, wird diese Funktion asynchron ausgeführt */
    let self =
      this; /*draw() wird wimmer wieder aufgerufen, diese Funktion befindet sich nicht in unserer aktuellen Welt, daher mit self arbeiten */
    requestAnimationFrame(function () {
      /* diese Funktion ruft this.ctx so oft auf, wie oft es die Grafikkarte es hergibt (gute Grafikkarte bis zu 25-60 FPS aufgerufen) */ self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.width, 0);
      this.ctx.scale(-1, 1);
      mo.x = mo.x * -1;
    }
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    if (mo.otherDirection) {
      mo.x = mo.x * -1;
      this.ctx.restore();
    }
  }
}