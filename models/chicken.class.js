class chicken extends MovableObject { /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */
    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500; /* Chicken wird auf auf der x-Achse beliebig/zufällig rechts positioniert */
    }

}