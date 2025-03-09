function init() {
  let canvas = document.getElementById('canvas');
  // 1) Wir rufen createLevel1() auf (in level1.js definiert)
  let level = createLevel1();
  // 2) Neue World mit dem neuen Level
  world = new World(canvas, keyboard, level);
}

function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  let canvas = document.getElementById('canvas');
  // Wieder frisch:
  let level = createLevel1();
  world = new World(canvas, keyboard, level);
}

class World {
  // Entfernt: "level = level1;" 
  character = new Character(); 
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  bossBar = new BossStatusBar();

  // minimaler Eingriff: wir nehmen (canvas, keyboard, level)
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;          // ← neu: das frische Level
    this.draw();
    this.setWorld();
    this.run();
  }

  stopGame() {
    if (this.runInterval) clearInterval(this.runInterval);
    if (this.moveInterval) clearInterval(this.moveInterval);
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    this.runInterval = setInterval(() => {
      if (!this.paused) {
        this.checkCollisionsEnemies();
        this.checkThrowObjects();
        this.checkCollisionsThrowables(); 
      }
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
        if (this.character.speedY < 0) {
          this.killChicken(enemy);
        } else {
          this.character.hit(enemy.damage);
          this.statusBar.setPercentage(this.character.energy);
        }
      }
      if (isBoss && this.character.isColliding(enemy)) {
        this.character.hit(enemy.damage * 2);
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    if (this.character.energy <= 0 && !this.gameOverShown) {
      this.gameOverShown = true;
      this.showGameOver();
    }
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
        this.showYouWin();
      }, 2000);
    }, 500);
  }

  showGameOver() {
    document
      .getElementById("overlay-gameover")
      .classList.remove("hidden");
  }
  
  showYouWin() {
    document
      .getElementById("overlay-youwin")
      .classList.remove("hidden");
  }

  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) this.throwableObjects.splice(i, 1);
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