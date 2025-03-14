class DrawableObject {
    img;
    imageCache = {}; /* JSON, das Bilder speichert, loadImages-Funktion basierend darauf erstellen */
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;




    loadImage(path) {
        this.img =
          new Image(); /* this.img = document.getElementbyID('image') <img id= "image"> (wäre das gleiche) */
        this.img.src = path;
      }


      draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }



      drawFrame(ctx) {
        if(this instanceof Character || this instanceof chicken || this instanceof Endboss) {
        ctx.beginPath();
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
      }
      }



      /**
   *
   * @param {Array} arr - ['img/image1.png', 'img/image2.png', … ] /* durch diese Bildpfade durchiterieren und zum ImageCache hinzufügen
   */
  loadImages(arr) {
    arr.forEach((path) => {
      /* dieses arr.forEach greift auf die 6 Bilder von Pepe Peligroso (Character) zu */
      let img = new Image(); /* Variable mit neuem Bild wird angelegt */
      img.src = path; /* Bild wird geladen in das Image-Objekt */
      this.imageCache[path] = img;
    }); /* wir machen das für mehrere Bilder und gehen somit durch alle Pfade durch, loadImages inkl. alle Bildpfade (bspw. von Charakter in den jeweiligen Klassen als Array hinzufügen  */
  }
    

}