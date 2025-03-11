function init() {
  let canvas = document.getElementById('canvas');
  let level = createLevel1();
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

/** 
 * Neu: Zeigt das Hauptmenü (overlay-menu),
 * blendet Canvas / H1 / gameover / youwin aus
 */
function goToMenu() {
  // 1) Overlays verstecken
  document.getElementById("overlay-gameover").classList.add("hidden");
  document.getElementById("overlay-youwin").classList.add("hidden");

  // 2) Canvas/H1 verstecken
  document.getElementById('canvas').style.display = 'none';
  let title = document.querySelector('h1');
  if (title) title.style.display = 'none';

  // 3) Zeige Menu-Overlay (falls du es in index.html angelegt hast)
  document.getElementById('overlay-menu').classList.remove('hidden');

  // optional: world.stopGame(); // falls du das Spiel an dieser Stelle komplett stoppen willst
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
  coinBar = new CoinBar();  
  coinsCollected = 0;
  bottleBar = new BottleBar();
  bottlesCollected = 0; 

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level; 
    this.chickenDeathSound = new Audio('audio/chicken-noise.mp3');
    this.chickenDeathSound.preload = 'auto';
    this.chickenDeathSound.load();
    this.pepeHurtSound = new Audio('audio/pepe-hurt.mp3');
    this.pepeHurtSound.preload = 'auto';
    this.pepeHurtSound.load();
    this.pepeDiesSound = new Audio('audio/pepe-dies.mp3');
    this.endbossDeathSound = new Audio('audio/endboss-noise.mp3');
    // (Optional) Vorladen, um die Verzögerung zu minimieren
    this.pepeDiesSound.preload = 'auto';
    this.pepeDiesSound.load();
    this.winGameSound = new Audio('audio/win-game.mp3');
    this.winGameSound.preload = 'auto';
    this.winGameSound.load();
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
        this.checkCollisionsCoins();
        this.checkCollisionsBottles();
      }
    }, 200);
  }

  checkThrowObjects() {
    // Nur wenn D gedrückt ODER wir haben >= 1 Flasche
    if (this.keyboard.D && this.bottlesCollected > 0) {
      // Flasche werfen
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
        this
      );
      this.throwableObjects.push(bottle);
  
      // => Counter für geworfene Flasche senken
      this.bottlesCollected--;
  
      // => Neu berechnen + Bar aktualisieren
      let percentage = this.bottlesCollected * 20;
      if (percentage < 0) percentage = 0; // nur zur Sicherheit
      this.bottleBar.setPercentage(percentage);
    }
  }  

  checkCollisionsEnemies() {
    this.level.enemies.forEach((enemy) => {
      let isHuhn = enemy instanceof chicken || enemy instanceof SmallChicken;
      let isBoss = enemy instanceof Endboss;
      if (this.gameOverShown) {
        return;
      }
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
        // Neu:
        bottle.triggerSplash();  
      }
      
      // Dasselbe für Endboss:
      if (isBoss && bottle.isColliding(enemy)) {
        enemy.hit(1);
        this.bossBar.setPercentage(enemy.energy * 20);
      
        // Neu:
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
        this.showYouWin();
      }, 2000);
    }, 500);
  }

  showGameOver() {
    document.getElementById("overlay-gameover").classList.remove("hidden");
  }
  
  showYouWin() {
    this.winGameSound.play();
    document.getElementById("overlay-youwin").classList.remove("hidden");
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
        // Coin entfernen + Zähler hoch      
        this.level.coins.splice(i, 1);
        this.coinsCollected++;
        let percentage = Math.floor(this.coinsCollected / 2) * 20;
        if (percentage > 100) percentage = 100;
        this.coinBar.setPercentage(percentage);
  
        // Sound
        let coinSound = new Audio('audio/collect-coin.mp3');
        coinSound.play();
        console.log('Coin #', this.coinsCollected, '=>', percentage, '%');
      }
    }
  }  

  checkCollisionsBottles() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      let bottleItem = this.level.bottles[i];
      // Prüfen, ob Character die Flasche berührt
      if (this.character.isColliding(bottleItem)) {
        // => aus dem Array entfernen
        this.level.bottles.splice(i, 1);
  
        // => Counter hochzählen
        this.bottlesCollected++;
        
        // => Bottle-Bar aktualisieren. 
        // => Je nach System: 1 Flasche = 20%, 5 Flaschen = 100%? 
        let percentage = this.bottlesCollected * 20;
        if (percentage > 100) percentage = 100;
        this.bottleBar.setPercentage(percentage);
  
        // ggf. Sound abspielen
        let bottleSound = new Audio('audio/collect-bottle.mp3');
        bottleSound.play();
      }
    }
  }  
}