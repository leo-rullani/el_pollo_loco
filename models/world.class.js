function init() {
  let canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");
  let canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  let levelData = loadCurrentLevel();
  world.loadLevelData(levelData, currentLevel);
  if (!world.musicMuted) {
    world.backgroundMusic.play().catch(e => {});
  }
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
  gameOverShown = false; // Neu: braucht ihr für "if (!world.gameOverShown)..."

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = null;
    this.initAudio();
    if (!this.musicMuted) {
      this.backgroundMusic.play().catch(e => {});
    }
    this.draw();
    this.setWorld();
    this.run();
  }

  initAudio() {
    this.backgroundMusic = this.makeAudio("audio/game-sound.mp3", 0.2, true);
    this.chickenDeathSound = this.makeAudio("audio/chicken-noise.mp3");
    this.pepeHurtSound = this.makeAudio("audio/pepe-hurt.mp3");
    this.pepeDiesSound = this.makeAudio("audio/pepe-dies.mp3");
    this.endbossDeathSound = this.makeAudio("audio/endboss-noise.mp3");
    this.winGameSound = this.makeAudio("audio/win-game.mp3");
    this.coinSound = this.makeAudio("audio/collect-coin.mp3");
    this.bottleSound = this.makeAudio("audio/collect-bottle.mp3");
    this.jumpSound = this.makeAudio("audio/jump.mp3");
    this.levelCompleteSound = this.makeAudio("audio/level-complete.mp3");
    this.bottleShatterSound = this.makeAudio("audio/bottle-shattering.mp3");
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
    this.coinSound.muted = m;
    this.bottleSound.muted = m;
    this.bottleShatterSound.muted = m;
    this.jumpSound.muted = m;
    this.levelCompleteSound.muted = m;
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
    // WICHTIG: Hier rufen wir die ausgelagerten Collision-Funktionen auf,
    // die in world-collisions.js definiert sind:
    this.runInterval = setInterval(() => {
      if (!this.paused && this.level) {
        checkCollisionsEnemies(this); // => in world-collisions.js
        this.checkThrowObjects();
        checkCollisionsThrowables(this); // => in world-collisions.js
        checkCollisionsCoins(this); // => in world-collisions.js
        checkCollisionsBottles(this); // => in world-collisions.js
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

  // bleibende Methoden, weil world-collisions.js ruft z.B. "world.killChicken(...)"

  killChicken(chicken) {
    this.chickenDeathSound.play();
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let idx = this.level.enemies.indexOf(chicken);
      if (idx > -1) this.level.enemies.splice(idx, 1);
    }, 250);
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