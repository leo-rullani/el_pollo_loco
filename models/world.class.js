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
      if (isHuhn && !enemy.isDeadChicken && this.character.isColliding(enemy)) {
        if (this.character.speedY < 0) this.killChicken(enemy);
        else {
          this.character.hit(enemy.damage);
          this.statusBar.setPercentage(this.character.energy);
        }
      }
      if (isBoss && this.character.isColliding(enemy)) {
        this.character.hit(enemy.damage * 2);
        this.statusBar.setPercentage(this.character.energy);
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
  
      if (isHuhn && !enemy.isDeadChicken && bottle.isColliding(enemy)) {
        this.killChicken(enemy);
        this.removeThrowableObject(bottle);
      }
      if (isBoss && bottle.isColliding(enemy)) {
        enemy.hit(1); 
        enemy.lastHit = new Date().getTime();
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
      if (i > -1) {
        this.level.enemies.splice(i, 1);
      }
    }, 500);
  }

  killEndboss(boss) {
    boss.playDeadAnimation();
    setTimeout(() => {
      boss.sinkBoss();
      setTimeout(() => {
        let i = this.level.enemies.indexOf(boss);
        if (i > -1) this.level.enemies.splice(i, 1);
        // z. B. showYouWinScreen();
      }, 2000);
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
  
    this.drawBossBarIfVisible(); // <= Aufruf
  
    this.ctx.translate(-this.camera_x, 0);
  }
  
  drawBossBarIfVisible() {
    let boss = this.findBoss();  // Sucht Endboss in level.enemies
    // z. B. Abfrage, ob boss existiert und x < 2200
    if (boss && boss.x < 2200) { 
      // "fixe" Position am Canvasrand
      this.ctx.save();
      this.ctx.translate(-this.camera_x, 0);
      this.addToMap(this.bossBar); // Hier zeichnest du bossBar
      this.ctx.restore();
    }
  }
  
  findBoss() {
    // Sucht in this.level.enemies nach dem Endboss
    return this.level.enemies.find((e) => e instanceof Endboss);
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
