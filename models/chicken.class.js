class chicken extends MovableObject {
  /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */

  y = 360;
  height = 60;
  width = 80;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x =
      200 +
      Math.random() *
        500; /* Chicken wird auf auf der x-Achse beliebig/zufällig rechts positioniert */
    this.animate();
  }

  /* Funktion, damit sich Wolken langsam nach links bewegen */
  animate() {
    setInterval(() => {
      this.x -= 1; /* das wird alle x-Sekunden ausgeführt, Variable flexibel veränderbar */
    }, 1000 / 60); /* Milisekunden, wie häufig soll sich dieses Invtervall wiederholen, 60 FPS, da die Werte sich 60 mal pro Sekunde aktualisieren (analog zu TV) */
  }
}
