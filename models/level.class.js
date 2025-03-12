class Level {
    enemies;
    clouds;
    coins;
    backgroundObjects;
    bottles;
    level_end_x;

    constructor(enemies, clouds, coins, bottles, backgroundObjects, level_end_x = 5000) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
        this.backgroundObjects = backgroundObjects;
        this.level_end_x = level_end_x; 
    }
}