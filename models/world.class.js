function init() {
  let canvas = document.getElementById("canvas");
  let level = createLevel3(); // DIREKT Level 3 zum Testen
  world = new World(canvas, keyboard, level);
}

function restartGame() {
  if (world) {
    world.stopGame();
  }
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  let canvas = document.getElementById("canvas");
  // Wieder frisch:
  let level = createLevel3(); // Wieder Level 3
  world = new World(canvas, keyboard, level);
}

/**
 * Neu: Zeigt das Hauptmenü (overlay-menu),
 * blendet Canvas / H1 / gameover / youwin aus
 */
function goToMenu() {
  // 1) Overlays verstecken
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  // 2) Canvas/H1 verstecken
  document.getElementById("canvas").style.display = "none";
  let title = document.querySelector("h1");
  if (title) title.style.display = "none";

  // 3) Zeige Menu-Overlay (falls du es in index.html angelegt hast)
  document.getElementById("overlay-menu").classList.remove("hidden");
  // optional: world.stopGame();
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

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;

    // Hintergrundmusik laden
    this.backgroundMusic = new Audio("audio/game-sound.mp3");
    this.backgroundMusic.volume = 0.2;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.preload = "auto";
    this.backgroundMusic.load();

    // Chicken-Death
    this.chickenDeathSound = new Audio("audio/chicken-noise.mp3");
    this.chickenDeathSound.preload = "auto";
    this.chickenDeathSound.load();

    // Pepe-Hurt
    this.pepeHurtSound = new Audio("audio/pepe-hurt.mp3");
    this.pepeHurtSound.preload = "auto";
    this.pepeHurtSound.load();

    // Pepe-Dies
    this.pepeDiesSound = new Audio("audio/pepe-dies.mp3");
    this.pepeDiesSound.preload = "auto";
    this.pepeDiesSound.load();

    // Endboss
    this.endbossDeathSound = new Audio("audio/endboss-noise.mp3");

    // Win-Game-Sound
    this.winGameSound = new Audio("audio/win-game.mp3");
    this.winGameSound.preload = "auto";
    this.winGameSound.load();

    // Mute-Flags
    this.musicMuted = false;
    this.sfxMuted = false;

    // Start
    this.draw();
    this.setWorld();
    this.run();
  }

  toggleMusicMute() {
    this.musicMuted = !this.musicMuted;
    this.backgroundMusic.muted = this.musicMuted;
  }

  toggleSfxMute() {
    this.sfxMuted = !this.sfxMuted;
    this.chickenDeathSound.muted = this.sfxMuted;
    this.pepeHurtSound.muted = this.sfxMuted;
    this.pepeDiesSound.muted = this.sfxMuted;
    this.endbossDeathSound.muted = this.sfxMuted;
    this.winGameSound.muted = this.sfxMuted;
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
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
        this.checkLevelEnd();
      }
    }, 200);
  }

  checkThrowObjects() {
    // Nur wenn D gedrückt ODER >= 1 Flasche
    if (this.keyboard.D && this.bottlesCollected > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        this
      );
      this.throwableObjects.push(bottle);

      this.bottlesCollected--;
      let percentage = this.bottlesCollected * 20;
      if (percentage < 0) percentage = 0;
      this.bottleBar.setPercentage(percentage);
    }
  }

  checkCollisionsEnemies() {
    this.level.enemies.forEach((enemy) => {
      let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
      let isBoss = enemy instanceof Endboss;
      if (this.gameOverShown) return;

      if (isHuhn && !enemy.isDeadChicken && this.character.isColliding(enemy)) {
        if (this.character.speedY < 0) {
          this.killChicken(enemy);
        } else {
          this.character.hit(enemy.damage);
          this.statusBar.setPercentage(this.character.energy);
          this.pepeHurtSound.play();
        }
      }
      if (isBoss && this.character.isColliding(enemy)) {
        this.character.hit(enemy.damage * 2);
        this.statusBar.setPercentage(this.character.energy);
        this.pepeHurtSound.play();
      }
    });
    if (this.character.energy <= 0 && !this.gameOverShown) {
      this.gameOverShown = true;
      this.pepeDiesSound.play();
      this.stopGame();
      this.showGameOver();
    }
  }

  checkCollisionsThrowables() {
    this.throwableObjects.forEach((bottle) => {
      this.handleBottleCollisions(bottle);
    });
  }

  killChicken(chicken) {
    this.chickenDeathSound.play();
    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let i = this.level.enemies.indexOf(chicken);
      if (i > -1) {
        this.level.enemies.splice(i, 1);
      }
    }, 500);
  }

  handleBottleCollisions(bottle) {
    this.level.enemies.forEach((enemy) => {
      let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
      let isBoss = enemy instanceof Endboss;
      if (isHuhn && !enemy.isDeadChicken && bottle.isColliding(enemy)) {
        this.killChicken(enemy);
        bottle.triggerSplash();
      }
      if (isBoss && bottle.isColliding(enemy)) {
        enemy.hit(1);
        this.bossBar.setPercentage(enemy.energy * 20);
        bottle.triggerSplash();
        if (enemy.isDead()) {
          this.killEndboss(enemy);
        }
      }
    });
  }

  killEndboss(boss) {
    this.endbossDeathSound.play();
    boss.playDeadAnimation();
    setTimeout(() => {
      boss.sinkBoss();
      setTimeout(() => {
        let i = this.level.enemies.indexOf(boss);
        if (i > -1) this.level.enemies.splice(i, 1);
        this.stopGame();
        this.showYouWin();
      }, 2000);
    }, 500);
  }

  showGameOver() {
    this.backgroundMusic.pause();
    document.getElementById("overlay-gameover").classList.remove("hidden");
  }

  showYouWin() {
    this.backgroundMusic.pause();
    this.winGameSound.play();
    document.getElementById("overlay-youwin").classList.remove("hidden");
    this.stopGame();
  }

  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) this.throwableObjects.splice(i, 1);
  }

  draw() {
    this.clearCanvas();
    this.drawScene();
    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawScene() {
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
    let boss = this.findBoss();
    if (boss) {
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

  checkCollisionsCoins() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      let coin = this.level.coins[i];
      if (this.character.isColliding(coin) && this.character.isAboveGround()) {
        this.level.coins.splice(i, 1);
        this.coinsCollected++;
        let percentage = Math.floor(this.coinsCollected / 2) * 20;
        if (percentage > 100) percentage = 100;
        this.coinBar.setPercentage(percentage);

        let coinSound = new Audio("audio/collect-coin.mp3");
        coinSound.play();
        console.log("Coin #", this.coinsCollected, "=>", percentage, "%");
      }
    }
  }

  checkCollisionsBottles() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      let bottleItem = this.level.bottles[i];
      if (this.character.isColliding(bottleItem)) {
        this.level.bottles.splice(i, 1);
        this.bottlesCollected++;
        let percentage = this.bottlesCollected * 20;
        if (percentage > 100) percentage = 100;
        this.bottleBar.setPercentage(percentage);

        let bottleSound = new Audio("audio/collect-bottle.mp3");
        bottleSound.play();
      }
    }
  }

  checkLevelEnd() {
    // 1) Prüfen, ob wir bereits das Level abgeschlossen haben (damit wir es nicht mehrmals aufrufen)
    if (this.levelComplete) {
      return;
    }
  
    // 2) Ist Charakter x >= level_end_x ?
    if (this.character.x >= this.level.level_end_x) {
      // => Markiere Level als abgeschlossen
      this.levelComplete = true;
  
      // => Rufe den Wechsel zur nächsten Stufe auf
      goToNextLevel();
    }
  }  
}