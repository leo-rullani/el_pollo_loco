/**
 * Checks for collisions between the character and all enemies in the current level.
 * If the character's energy reaches 0, triggers game over.
 * @param {World} world - The current game world containing the character, enemies, etc.
 */
function checkCollisionsEnemies(world) {
  if (!world.level) return;
  world.level.enemies.forEach((e) => handleEnemy(world, e));
  if (world.character.energy <= 0 && !world.gameOverShown)
    handleGameOver(world);
}

/**
 * Handles collision logic with a single enemy (chicken or end boss).
 * @param {World} world - The current game world.
 * @param {MovableObject} e - The enemy to check collision with.
 */
function handleEnemy(world, e) {
  if (world.gameOverShown) return;
  let isHuhn = e instanceof chicken || e instanceof SmallChicken;
  let isBoss = e instanceof Endboss;

  if (isHuhn && !e.isDeadChicken && world.character.isColliding(e)) {
    huhnCollision(world, e);
  }
  if (isBoss && world.character.isColliding(e)) {
    bossCollision(world, e);
  }
}

function huhnCollision(world, enemy) {
  /**
   * The "feet" position of the character, calculated at 90% of its height.
   * This makes it easier to land on the chicken without exact pixel precision.
   * @type {number}
   */
  let characterFeet = world.character.y + (world.character.height * 0.9);

  /**
   * The "top" of the chicken, set at 70% of its height.
   * Adjust this to make the chicken easier or harder to stomp.
   * @type {number}
   */
  let chickenTop = enemy.y + (enemy.height * 0.7);
  if (characterFeet < chickenTop) {
    world.killChicken(enemy);
    world.character.speedY = 20;
  } else {
    world.character.hit(enemy.damage);
    world.statusBar.setPercentage(world.character.energy);
    world.pepeHurtSound.play();
  }
}

/**
 * Handles collision logic specifically for the end boss.
 * Deals extra damage to the character and positions it accordingly.
 * @param {World} world - The current game world.
 * @param {Endboss} boss - The boss enemy.
 */
function bossCollision(world, boss) {
  world.character.hit(boss.damage * 2);
  world.statusBar.setPercentage(world.character.energy);
  world.pepeHurtSound.play();
  if (world.character.x + world.character.width > boss.x) {
    world.character.x = boss.x - world.character.width;
  }
}

/**
 * Triggers game over when the character's energy reaches 0.
 * @param {World} world - The current game world.
 */
function handleGameOver(world) {
  world.gameOverShown = true;
  world.pepeDiesSound.play();
  world.stopGame();
  world.showGameOver();
}

/**
 * Checks for collisions between throwable objects and enemies in the current level.
 * @param {World} world - The current game world.
 */
function checkCollisionsThrowables(world) {
  if (!world.level) return;
  world.throwableObjects.forEach((b) => handleBottleCollisions(world, b));
}

/**
 * Manages collision checks for a single thrown bottle against all enemies.
 * @param {World} world - The current game world.
 * @param {ThrowableObject} bottle - The thrown bottle to check for collisions.
 */
function handleBottleCollisions(world, bottle) {
  world.level.enemies.forEach((e) => collideBottleEnemy(world, bottle, e));
}

/**
 * Checks if a thrown bottle collides with a chicken or the end boss.
 * Triggers splash or kills the enemy if conditions are met.
 * @param {World} world - The current game world.
 * @param {ThrowableObject} bottle - The thrown bottle.
 * @param {MovableObject} e - The enemy to check collision with (chicken or end boss).
 */


/**
 * Checks for collisions between the character and coins on the ground.
 * If collected, updates coin count and may boost the character's energy.
 * @param {World} world - The current game world.
 */
function checkCollisionsCoins(world) {
  if (!world.level) return;
  for (let i = world.level.coins.length - 1; i >= 0; i--) {
    let coin = world.level.coins[i];
    if (isCollidingWithOffset(world.character, coin, 20) 
        && world.character.isAboveGround()) {
      world.level.coins.splice(i, 1);
      world.coinsCollected++;
      let p = calcCoinPercentage(world.coinsCollected);
      if (p > 100) p = 100;
      world.coinBar.setPercentage(p);
      if (p >= 100) boostCharacterEnergy(world);
      world.coinSound.currentTime = 0;
      world.coinSound.play();
    }
  }
}

function isCollidingWithOffset(a, b, offset) {
  // a.x + a.width - offset > b.x + offset => du brauchst noch mehr Überlappung
  return (
    (a.x + a.width - offset) > (b.x + offset) &&
    (a.y + a.height - offset) > (b.y + offset) &&
    (a.x + offset) < (b.x + b.width - offset) &&
    (a.y + offset) < (b.y + b.height - offset)
  );
}

/**
 * Checks if a thrown bottle collides with a chicken or the end boss
 * using a standard bounding box overlap (offset = 0).
 * Triggers splash or kills the enemy if conditions are met.
 *
 * @param {World} world - The current game world.
 * @param {ThrowableObject} bottle - The thrown bottle to check for collisions.
 * @param {MovableObject} e - The enemy to check collision with (chicken or end boss).
 */
function collideBottleEnemy(world, bottle, e) {
  let h = e instanceof chicken || e instanceof SmallChicken;
  let b = e instanceof Endboss;
  if (h && !e.isDeadChicken && isCollidingWithOffset(bottle, e, 0)) {
    world.killChicken(e);
    bottle.triggerSplash();
  }
  if (b && isCollidingWithOffset(bottle, e, 0)) {
    e.hit(1);
    world.bossBar.setPercentage(e.energy * 20);
    bottle.triggerSplash();
    if (e.isDead()) world.killEndboss(e);
  }
}

/**
 * Checks a collision between two objects 'a' and 'b'
 * with a provided offset in all directions (0 means no offset).
 * 
 * @param {MovableObject|ThrowableObject} a - First object (e.g. bottle).
 * @param {MovableObject} b - Second object (e.g. enemy).
 * @param {number} offset - Positive shrinks the box, negative grows it (0 = exact bounding box).
 * @returns {boolean} True if the two objects (with offset) overlap, otherwise false.
 */
function isCollidingWithOffset(a, b, offset) {
  return (
    (a.x + a.width - offset) > (b.x + offset) &&
    (a.y + a.height - offset) > (b.y + offset) &&
    (a.x + offset) < (b.x + b.width - offset) &&
    (a.y + offset) < (b.y + b.height - offset)
  );
}

/**
 * Boosts the character's energy after collecting enough coins
 * to fill the coin bar to 100%.
 * @param {World} world - The current game world.
 */
function boostCharacterEnergy(world) {
  world.coinsCollected = 0;
  world.coinBar.setPercentage(0);
  world.character.energy += 20;
  if (world.character.energy > 100) {
    world.character.energy = 100;
  }
  world.statusBar.setPercentage(world.character.energy);
}

/**
 * Checks for collisions between the character and bottles on the ground.
 * If collected, updates the bottle count accordingly.
 * @param {World} world - The current game world.
 */
function checkCollisionsBottles(world) {
  if (!world.level) return;
  for (let i = world.level.bottles.length - 1; i >= 0; i--) {
    let bottleItem = world.level.bottles[i];
    if (world.character.isColliding(bottleItem)) {
      world.level.bottles.splice(i, 1);
      world.bottlesCollected++;
      let p = world.bottlesCollected * 20;
      if (p > 100) p = 100;
      world.bottleBar.setPercentage(p);
      world.bottleSound.currentTime = 0;
      world.bottleSound.play();
    }
  }
}