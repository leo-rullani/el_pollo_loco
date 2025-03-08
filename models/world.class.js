class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  bossBar = new BossStatusBar();

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
      let isBoss = enemy instanceof Endboss;

      // === Huhn-Kollision ===
      if (isHuhn && !enemy.isDeadChicken && this.character.isColliding(enemy)) {
        if (this.character.speedY < 0) this.killChicken(enemy);
        else {
          this.character.hit(enemy.damage);
          this.statusBar.setPercentage(this.character.energy);
        }
      }

      // === Boss-Kollision ===
      if (isBoss && this.character.isColliding(enemy)) {
        this.character.hit(enemy.damage * 2);
        this.statusBar.setPercentage(this.character.energy);
      }

      // === Prüfe Game Over ===
      if (this.character.energy <= 0) {
        this.showGameOver();
      }
    });
  }

  checkCollisionsThrowables() {
    this.throwableObjects.forEach((bottle) => {
      this.handleBottleCollisions(bottle);
    });
  }

  handleBottleCollisions(bottle) {
    this.level.enemies.forEach((enemy) => {
      let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
      let isBoss = enemy instanceof Endboss;

      // === Huhn-Treffer ===
      if (isHuhn && !enemy.isDeadChicken && bottle.isColliding(enemy)) {
        this.killChicken(enemy);
        this.removeThrowableObject(bottle);
      }

      // === Boss-Treffer ===
      if (isBoss && bottle.isColliding(enemy)) {
        enemy.hit(1);
        enemy.lastHit = new Date().getTime();
        this.bossBar.setPercentage(enemy.energy * 20);
        this.removeThrowableObject(bottle);

        if (enemy.isDead()) this.killEndboss(enemy);
      }
    });
  }

  killChicken(chicken) {
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let i = this.level.enemies.indexOf(chicken);
      if (i > -1) this.level.enemies.splice(i, 1);
    }, 500);
  }

  killEndboss(boss) {
    boss.playDeadAnimation();
    setTimeout(() => {
      boss.sinkBoss();
      setTimeout(() => {
        let i = this.level.enemies.indexOf(boss);
        if (i > -1) this.level.enemies.splice(i, 1);
        this.showYouWin(); // Endboss besiegt => You Win
      }, 2000);
    }, 500);
  }

  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) this.throwableObjects.splice(i, 1);
  }

  showGameOver() {
    document.getElementById("overlay-gameover").classList.remove("hidden");
    // Hier könntest du das Spiel stoppen oder weitere Aktionen ausführen
  }

  showYouWin() {
    document.getElementById("overlay-youwin").classList.remove("hidden");
    // Hier kannst du ggf. das Spiel stoppen, Sound abspielen etc.
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

    this.drawBossBarIfVisible();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawBossBarIfVisible() {
    let boss = this.findBoss();
    if (boss && boss.x < 2200) {
      this.ctx.save();
      this.ctx.translate(-this.camera_x, 0);
      this.addToMap(this.bossBar);
      this.ctx.restore();
    }
  }

  findBoss() {
    return this.level.enemies.find((e) => e instanceof Endboss);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
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
