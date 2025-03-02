class Character extends MovableObject {  /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */

    height = 280;
    y = 155;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    }

    jump() {

    }

}