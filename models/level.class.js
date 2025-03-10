class Level {
    enemies;
    clouds;
    coins;
    backgroundObjects;
    level_end_x = 2200;
    bottles;

    constructor(enemies, clouds, coins, bottles, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
        this.backgroundObjects = backgroundObjects;
    }
}