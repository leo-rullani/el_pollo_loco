function init() {
  let canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function restartGame() {
  if (world) world.stopGame();
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  let canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function goToMenu() {
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  document.getElementById("canvas").style.display = "none";
  let title = document.querySelector("h1");
  if (title) title.style.display = "none";
  document.getElementById("overlay-menu").classList.remove("hidden");
}

class World {
  character = new Character();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  bossBar = new BossStatusBar();
  coinBar = new CoinBar();
  coinsCollected = 0;
  bottleBar = new BottleBar();
  bottlesCollected = 0;
  currentLevelNumber;
  paused = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = null;
    this.initAudio();
    this.draw();
    this.setWorld();
    this.run();
  }

  initAudio() {
    this.backgroundMusic = this.makeAudio("audio/game-sound.mp3", 0.2, true);
    this.chickenDeathSound = this.makeAudio("audio/chicken-noise.mp3");
    this.pepeHurtSound = this.makeAudio("audio/pepe-hurt.mp3");
    this.pepeDiesSound = this.makeAudio("audio/pepe-dies.mp3");
    this.endbossDeathSound = new Audio("audio/endboss-noise.mp3");
    this.winGameSound = this.makeAudio("audio/win-game.mp3");
    this.musicMuted = false;
    this.sfxMuted = false;
  }

  makeAudio(src, vol = 1, loop = false) {
    let a = new Audio(src);
    a.volume = vol;
    a.loop = loop;
    a.preload = "auto";
    a.load();
    return a;
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    this.backgroundMusic.muted = this.musicMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    let m = this.sfxMuted;
    this.chickenDeathSound.muted = m;
    this.pepeHurtSound.muted = m;
    this.pepeDiesSound.muted = m;
    this.endbossDeathSound.muted = m;
    this.winGameSound.muted = m;
  }

  stopGame() {
    if (this.runInterval) clearInterval(this.runInterval);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.character?.stopIntervals) this.character.stopIntervals();
    this.stopEnemies();
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  stopEnemies() {
    if (!this.level?.enemies) return;
    this.level.enemies.forEach((e) => e.stopIntervals && e.stopIntervals());
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    this.runInterval = setInterval(() => {
      if (!this.paused && this.level) {
        this.checkCollisionsEnemies();
        this.checkThrowObjects();
        this.checkCollisionsThrowables();
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
        this.checkLevelEnd();
      }
    }, 200);
  }

  checkThrowObjects() {
    if (!this.level) return;
    if (this.keyboard.D && this.bottlesCollected > 0) this.throwBottle();
  }

  throwBottle() {
    let b = new ThrowableObject(
      this.character.x + 50,
      this.character.y + 100,
      this
    );
    this.throwableObjects.push(b);
    this.bottlesCollected--;
    let perc = this.bottlesCollected * 20;
    if (perc < 0) perc = 0;
    this.bottleBar.setPercentage(perc);
  }

  checkCollisionsEnemies() {
    if (!this.level) return;
    this.level.enemies.forEach((e) => this.handleEnemy(e));
    if (this.character.energy <= 0 && !this.gameOverShown)
      this.handleGameOver();
  }

  handleEnemy(e) {
    let isHuhn = e instanceof chicken || e instanceof SmallChicken;
    let isBoss = e instanceof Endboss;
    if (this.gameOverShown) return;
    if (isHuhn && !e.isDeadChicken && this.character.isColliding(e)) {
      this.huhnCollision(e);
    }
    if (isBoss && this.character.isColliding(e)) {
      this.bossCollision(e);
    }
  }

  huhnCollision(enemy) {
    if (this.character.speedY < 0) this.killChicken(enemy);
    else {
      this.character.hit(enemy.damage);
      this.statusBar.setPercentage(this.character.energy);
      this.pepeHurtSound.play();
    }
  }

  bossCollision(boss) {
    this.character.hit(boss.damage * 2);
    this.statusBar.setPercentage(this.character.energy);
    this.pepeHurtSound.play();
    if (this.character.x + this.character.width > boss.x) {
      this.character.x = boss.x - this.character.width;
    }
  }

  handleGameOver() {
    this.gameOverShown = true;
    this.pepeDiesSound.play();
    this.stopGame();
    this.showGameOver();
  }

  checkCollisionsThrowables() {
    if (!this.level) return;
    this.throwableObjects.forEach((b) => this.handleBottleCollisions(b));
  }

  killChicken(chicken) {
    this.chickenDeathSound.play();
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let idx = this.level.enemies.indexOf(chicken);
      if (idx > -1) this.level.enemies.splice(idx, 1);
    }, 250);
  }

  handleBottleCollisions(bottle) {
    this.level.enemies.forEach((e) => this.collideBottleEnemy(bottle, e));
  }

  collideBottleEnemy(bottle, e) {
    let h = e instanceof chicken || e instanceof SmallChicken;
    let b = e instanceof Endboss;
    if (h && !e.isDeadChicken && bottle.isColliding(e)) {
      this.killChicken(e);
      bottle.triggerSplash();
    }
    if (b && bottle.isColliding(e)) this.bottleHitsBoss(bottle, e);
  }

  bottleHitsBoss(bottle, boss) {
    boss.hit(1);
    this.bossBar.setPercentage(boss.energy * 20);
    bottle.triggerSplash();
    if (boss.isDead()) this.killEndboss(boss);
  }

  killEndboss(boss) {
    this.endbossDeathSound.play();
    boss.playDeadAnimation();
    setTimeout(() => {
      boss.sinkBoss();
      setTimeout(() => {
        let idx = this.level.enemies.indexOf(boss);
        if (idx > -1) this.level.enemies.splice(idx, 1);
        this.stopGame();
        this.showYouWin();
      }, 2000);
    }, 500);
  }

  showGameOver() {
    this.backgroundMusic.pause();
    document.getElementById("overlay-gameover")?.classList.remove("hidden");
  }

  showYouWin() {
    this.backgroundMusic.pause();
    this.winGameSound.play();
    document.getElementById("overlay-youwin")?.classList.remove("hidden");
    this.stopGame();
  }

  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) this.throwableObjects.splice(i, 1);
  }

  draw() {
    this.clearCanvas();
    this.drawScene();
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawScene() {
    if (!this.level) return;
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bottleBar);
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.drawBossBarIfVisible();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawBossBarIfVisible() {
    let b = this.findBoss();
    if (!b) return;
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.bossBar);
    this.ctx.restore();
  }

  findBoss() {
    if (!this.level) return null;
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
    mo.x *= -1;
  }

  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }

  checkCollisionsCoins() {
    if (!this.level) return;
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      this.handleCoinCollision(this.level.coins[i], i);
    }
  }

  handleCoinCollision(coin, idx) {
    if (!this.character.isColliding(coin) || !this.character.isAboveGround())
      return;
    this.level.coins.splice(idx, 1);
    this.coinsCollected++;
    let p = calcCoinPercentage(this.coinsCollected);
    if (p > 100) p = 100;
    this.coinBar.setPercentage(p);
    if (p >= 100) this.boostCharacterEnergy();
    new Audio("audio/collect-coin.mp3").play();
  }

  boostCharacterEnergy() {
    this.coinsCollected = 0;
    this.coinBar.setPercentage(0);
    this.character.energy += 20;
    if (this.character.energy > 100) this.character.energy = 100;
    this.statusBar.setPercentage(this.character.energy);
  }

  checkCollisionsBottles() {
    if (!this.level) return;
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      this.handleBottleItem(this.level.bottles[i], i);
    }
  }

  handleBottleItem(bottleItem, idx) {
    if (!this.character.isColliding(bottleItem)) return;
    this.level.bottles.splice(idx, 1);
    this.bottlesCollected++;
    let p = this.bottlesCollected * 20;
    if (p > 100) p = 100;
    this.bottleBar.setPercentage(p);
    new Audio("audio/collect-bottle.mp3").play();
  }

  checkLevelEnd() {
    if (!this.level || this.levelComplete) return;
    if (this.character.x >= this.level.level_end_x) {
      this.levelComplete = true;
      let o = document.getElementById("overlay-levelcomplete");
      if (o) {
        o.innerHTML = `<h1>Level ${this.currentLevelNumber} Completed!</h1>`;
        o.classList.remove("hidden");
      }
      setTimeout(() => {
        if (o) o.classList.add("hidden");
        goToNextLevel();
      }, 1000);
    }
  }

  loadLevelData(newLevel, levelNumber) {
    this.level = newLevel;
    this.currentLevelNumber = levelNumber;
    this.levelComplete = false;
    this.throwableObjects = [];
    this.character.x = 0;
    this.character.y = 95;
    this.camera_x = 0;
  }

  pauseGame() {
    this.paused = true;
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.character?.stopIntervals) this.character.stopIntervals();
    this.stopEnemies();
    let c = document.querySelector(".canvas-container");
    if (c) c.classList.add("paused-overlay");
  }
}