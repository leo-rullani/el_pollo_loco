class World {
  character = new Character();
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

  run() {
    setInterval(() => {
      this.checkCollisionsEnemies();
      this.checkCollisionsThrowables();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        this
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisionsEnemies() {
    this.level.enemies.forEach((enemy) => {
      let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
      if (!enemy.isDeadChicken && isHuhn && this.character.isColliding(enemy)) {
        if (this.character.speedY < 0) {
          this.killChicken(enemy);
        } else {
          this.character.hit(enemy.damage);
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  checkCollisionsThrowables() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
        if (!enemy.isDeadChicken && isHuhn && bottle.isColliding(enemy)) {
          this.killChicken(enemy);
          this.removeThrowableObject(bottle);
        }
      });
    });
  }

  killChicken(chicken) {
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
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
    this.clearCanvas();
    this.drawScene();
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawScene() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
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