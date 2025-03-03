class cloud extends MovableObject {
  /* Chicken hat mit "extends" nun alle Eigenschaften, die MovablaObject auch hat, auch wenn die Klasse leer wäre */
  y = 20;
  width = 500;
  height = 250; /* diese Variablen müssen nicht dynamisch sein, daher nicht im Konstruktor */

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");

    this.x =
      0 +
      Math.random() *
        500; /* Chicken wird auf auf der x-Achse beliebig/zufällig rechts positioniert */
    this.animate();
  }

  /* Funktion, damit sich Wolken langsam nach links bewegen */
  animate() {
    setInterval(() => {
      this.x -= 0.15; /* das wird alle x-Sekunden ausgeführt, Variable flexibel veränderbar */
    }, 1000 / 60); /* Milisekunden, wie häufig soll sich dieses Invtervall wiederholen, 60 FPS, da die Werte sich 60 mal pro Sekunde aktualisieren (analog zu TV) */
  }
}