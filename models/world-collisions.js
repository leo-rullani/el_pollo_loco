function checkCollisionsEnemies(world) {
    if (!world.level) return;
    world.level.enemies.forEach((e) => handleEnemy(world, e));
    if (world.character.energy <= 0 && !world.gameOverShown) handleGameOver(world);
  }
  
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
    if (world.character.speedY < 0) {
      world.killChicken(enemy);
    } else {
      world.character.hit(enemy.damage);
      world.statusBar.setPercentage(world.character.energy);
      world.pepeHurtSound.play();
    }
  }
  
  function bossCollision(world, boss) {
    world.character.hit(boss.damage * 2);
    world.statusBar.setPercentage(world.character.energy);
    world.pepeHurtSound.play();
    if (world.character.x + world.character.width > boss.x) {
      world.character.x = boss.x - world.character.width;
    }
  }
  
  function handleGameOver(world) {
    world.gameOverShown = true;
    world.pepeDiesSound.play();
    world.stopGame();
    world.showGameOver();
  }
  
  function checkCollisionsThrowables(world) {
    if (!world.level) return;
    world.throwableObjects.forEach(b => handleBottleCollisions(world, b));
  }
  
  function handleBottleCollisions(world, bottle) {
    world.level.enemies.forEach(e => collideBottleEnemy(world, bottle, e));
  }
  
  function collideBottleEnemy(world, bottle, e) {
    let h = e instanceof chicken || e instanceof SmallChicken;
    let b = e instanceof Endboss;
    if (h && !e.isDeadChicken && bottle.isColliding(e)) {
      world.killChicken(e);
      bottle.triggerSplash();
    }
    if (b && bottle.isColliding(e)) {
      e.hit(1);
      world.bossBar.setPercentage(e.energy * 20);
      bottle.triggerSplash();
      if (e.isDead()) world.killEndboss(e);
    }
  }
  
  function checkCollisionsCoins(world) {
    if (!world.level) return;
    for (let i = world.level.coins.length - 1; i >= 0; i--) {
      let coin = world.level.coins[i];
      if (world.character.isColliding(coin) && world.character.isAboveGround()) {
        world.level.coins.splice(i, 1);
        world.coinsCollected++;
        let p = calcCoinPercentage(world.coinsCollected);
        if (p > 100) p = 100;
        world.coinBar.setPercentage(p);
        if (p >= 100) boostCharacterEnergy(world);
        new Audio("audio/collect-coin.mp3").play();
      }
    }
  }
  
  function boostCharacterEnergy(world) {
    world.coinsCollected = 0;
    world.coinBar.setPercentage(0);
    world.character.energy += 20;
    if (world.character.energy > 100) {
      world.character.energy = 100;
    }
    world.statusBar.setPercentage(world.character.energy);
  }
  
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
        new Audio("audio/collect-bottle.mp3").play();
      }
    }
  }
