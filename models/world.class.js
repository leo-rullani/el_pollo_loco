/**
 * The main World class, containing the character, level data, audio, drawing methods, and overall game logic loops.
 */
class World {
  /** @type {Character} */
  character = new Character();
  /** @type {HTMLCanvasElement} */
  canvas;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @type {Keyboard} */
  keyboard;
  /** @type {number} */
  camera_x = 0;
  /** @type {StatusBar} */
  statusBar = new StatusBar();
  /** @type {ThrowableObject[]} */
  throwableObjects = [];
  /** @type {BossStatusBar} */
  bossBar = new BossStatusBar();
  /** @type {CoinBar} */
  coinBar = new CoinBar();
  /** @type {number} */
  coinsCollected = 0;
  /** @type {BottleBar} */
  bottleBar = new BottleBar();
  /** @type {number} */
  bottlesCollected = 0;
  /** @type {number} */
  currentLevelNumber;
  /** @type {boolean} */
  paused = false;
  /** @type {boolean} */
  gameOverShown = false;
  /** @type {Level|null} */
  level = null;
  /** @type {number|undefined} */
  runInterval;
  /** @type {number|undefined} */
  animationFrameId;
  /** @type {boolean} */
  levelComplete = false;

  /**
   * Creates a new World instance, initializes audio, draws the scene, and starts the update loop (run).
   * @param {HTMLCanvasElement} canvas - The game's drawing canvas.
   * @param {Keyboard} keyboard - The keyboard instance for controls.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.initAudio();
    if (window.soundManager) {
      soundManager.playSound(this.backgroundMusic, true);
    } else {
      this.backgroundMusic.play().catch((e) => {});
    }
    this.draw();
    this.setWorld();
    this.run();
  }

  /** Initializes all audio objects (music, sfx). */
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
  }

  /**
   * Creates a new Audio object with given src, volume, and loop settings.
   * @param {string} src - Audio file path.
   * @param {number} [vol=1] - Volume (0–1).
   * @param {boolean} [loop=false] - Whether the audio should loop.
   * @returns {HTMLAudioElement} The configured audio object.
   */
  makeAudio(src, vol = 1, loop = false) {
    let a = new Audio(src);
    a.volume = vol;
    a.loop = loop;
    a.preload = "auto";
    a.load();
    return a;
  }

  /** Stops the main update loops, animation, and enemy intervals, and pauses music. */
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

  /** Calls stopIntervals on each enemy, if available, to halt their movement/animation. */
  stopEnemies() {
    if (!this.level?.enemies) return;
    this.level.enemies.forEach((e) => e.stopIntervals && e.stopIntervals());
  }

  /** Registers the world reference in the character so it can interact with the environment. */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Sets up a loop to periodically check collisions and other updates, unless the game is paused or the level is missing.
   */
  run() {
    this.runInterval = setInterval(() => {
      if (!this.paused && this.level) {
        checkCollisionsEnemies(this);
        this.checkThrowObjects();
        checkCollisionsThrowables(this);
        checkCollisionsCoins(this);
        checkCollisionsBottles(this);
        this.checkLevelEnd();
      }
    }, 200);
  }

  /**
   * Checks if the player wants to throw a bottle (D key pressed) and has bottles available.
   */
  checkThrowObjects() {
    if (!this.level) return;
    if (this.keyboard.D && this.bottlesCollected > 0) this.throwBottle();
  }

  /** Creates a new ThrowableObject, updates bottle count, and animates the throw. */
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

  /**
   * Plays the chicken-death sound, triggers the dead animation, and removes the chicken from the level after a short delay.
   * @param {chicken|SmallChicken} chicken - The chicken to be removed.
   */
  killChicken(chicken) {
    if (window.soundManager) {
      soundManager.playSound(this.chickenDeathSound, false);
    } else {
      this.chickenDeathSound.play();
    }

    chicken.isDeadChicken = true;
    chicken.playDeadAnimation();
    setTimeout(() => {
      let idx = this.level.enemies.indexOf(chicken);
      if (idx > -1) this.level.enemies.splice(idx, 1);
    }, 250);
  }

  /**
   * Plays the endboss-death sound, triggers its death/fall animations, removes the boss, ends the game, and shows the "You Win" overlay.
   * @param {Endboss} boss - The end boss to remove.
   */
  killEndboss(boss) {
    if (window.soundManager) {
      soundManager.playSound(this.endbossDeathSound, false);
    } else {
      this.endbossDeathSound.play();
    }
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

  /** Pauses background music and shows the "Game Over" overlay. */
  showGameOver() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    document.getElementById("overlay-gameover")?.classList.remove("hidden");
  }

  /** Pauses background music, plays win sound, shows "You Win", and stops the game. */
  showYouWin() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    if (window.soundManager) {
      soundManager.playSound(this.winGameSound, false);
    } else {
      this.winGameSound.play();
    }
    document.getElementById("overlay-youwin")?.classList.remove("hidden");
    this.stopGame();
  }

  /** Removes the given bottle from the throwableObjects array in this world. */
  removeThrowableObject(bottle) {
    let i = this.throwableObjects.indexOf(bottle);
    if (i > -1) this.throwableObjects.splice(i, 1);
  }

  /**
   * The main render loop: clears canvas, draws scene, and requests the next frame.
   */
  draw() {
    this.clearCanvas();
    this.drawScene();
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /** Clears the entire canvas area before drawing the next frame. */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws all game objects and HUD elements in the correct order, translating the camera as needed.
   */
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

  /** If a boss is present, temporarily untranslate the camera to draw its status bar. */
  drawBossBarIfVisible() {
    let b = this.findBoss();
    if (!b) return;
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.bossBar);
    this.ctx.restore();
  }

  /** Finds the Endboss in the current level's enemies list, if any. */
  findBoss() {
    if (!this.level) return null;
    return this.level.enemies.find((e) => e instanceof Endboss);
  }

  /** Iterates over the given objects array, drawing each onto the map. */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws a movable object or status bar, flipping if necessary.
   * @param {DrawableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the canvas horizontally for mirrored drawing (e.g., facing left).
   * @param {MovableObject} mo - The object to be flipped.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x *= -1;
  }

  /** Restores the canvas after flipping, returning the object to normal orientation. */
  flipImageBack(mo) {
    mo.x *= -1;
    this.ctx.restore();
  }

  /**
   * Checks whether the character has reached the end of the level,
   * triggers a level-complete overlay, and calls goToNextLevel().
   */
  checkLevelEnd() {
    if (!this.level || this.levelComplete) return;

    if (this.character.x >= this.level.level_end_x) {
      this.levelCompleteSound.currentTime = 0;
      if (window.soundManager) {
        soundManager.playSound(this.levelCompleteSound, false);
      } else {
        this.levelCompleteSound.play();
      }

      this.levelComplete = true;

      let o = document.getElementById("overlay-levelcomplete");
      if (o) {
        o.innerHTML = `<h1>Level ${this.currentLevelNumber} Completed!</h1>`;
        o.classList.remove("hidden");
      }

      setTimeout(() => {
        if (o) o.classList.add("hidden");
        goToNextLevel(); // calls the global function from game.js
      }, 1000);
    }
  }

  /**
   * Loads a new level's data, resets the camera/character positions,and clears previous throwable objects.
   * @param {Level} newLevel - The new level to load.
   * @param {number} levelNumber - The level index (e.g., 1,2,3).
   */
  loadLevelData(newLevel, levelNumber) {
    this.level = newLevel;
    this.currentLevelNumber = levelNumber;
    this.levelComplete = false;
    this.throwableObjects = [];
    this.character.x = 0;
    this.character.y = 95;
    this.camera_x = 0;
  }

  /**
   * Pauses the game by stopping intervals and canceling animation, also pausing the character and all enemies.
   */
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
  }

  /**
   * Resumes the game by restoring intervals, resuming animations, and continuing collision checks if the level exists.
   */
  resumeGame() {
    this.paused = false;
    this.character?.resumeIntervals?.();
    this.level?.enemies?.forEach((e) => e.resumeIntervals?.());
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
    this.initCollisionCheck();
  }

  initCollisionCheck() {
    if (!this.runInterval) {
      this.runInterval = setInterval(() => {
        if (!this.paused && this.level) {
          checkCollisionsEnemies(this);
          this.checkThrowObjects();
          checkCollisionsThrowables(this);
          checkCollisionsCoins(this);
          checkCollisionsBottles(this);
          this.checkLevelEnd();
        }
      }, 200);
    }
  }
}