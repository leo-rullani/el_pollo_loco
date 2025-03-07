class World {
  character = new Character(); /* Variable definiert und der ein Objekt zugewiesen */
    level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run(){
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      // this => die Instanz der World
      let bottle = new ThrowableObject(
        this.character.x + 100, 
        this.character.y + 100,
        this // Referenz auf die aktuelle World
      );
      this.throwableObjects.push(bottle);
    }
  }  
  

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof chicken) {
        // 1) Charakter kollidiert mit Chicken
        if (this.character.isColliding(enemy)) {
          // Prüfen, ob Pepe von oben kommt => Sprung-Kill
          if (this.character.speedY < 0) {
            this.killChicken(enemy);
          } else {
            // Sonst => Charakter nimmt Schaden
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
          }
        }
      }
    });
  
    // Falls du Flaschen-Treffer abfragen willst, kommt das hier:
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof chicken && bottle.isColliding(enemy)) {
          this.killChicken(enemy);
          this.removeThrowableObject(bottle); // z. B. Flasche verschwindet
        }
      });
    });
  }
  
  killChicken(chicken) {
    // 1) Dead-Animation abspielen
    chicken.playDeadAnimation();
  
    // 2) Nach z. B. 500ms aus dem Array entfernen
    setTimeout(() => {
      let i = this.level.enemies.indexOf(chicken);
      if (i > -1) {
        this.level.enemies.splice(i, 1);
      }
    }, 500);
  }
  
  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) {
      this.throwableObjects.splice(i, 1);
    }
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
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0); // Back
    // ------ Space for fixed Objects ------
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0); // Forwards


    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);


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
      this.flipImage (mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
