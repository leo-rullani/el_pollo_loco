class World {
  character = new Character(); /* Variable definiert und der ein Objekt zugewiesen */
  enemies = [new chicken(), new chicken(), new chicken()];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.draw()
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); /* immer ganz zu Beginn unserer draw()-Methode aufrufen */
    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    this.enemies.forEach (enemy => {
        this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    /* sobald alles darüber ausgeführt ist, wird diese Funktion asynchron ausgeführt */
    let self = this; /*draw() wird wimmer wieder aufgerufen, diese Funktion befindet sich nicht in unserer aktuellen Welt, daher mit self arbeiten */
    requestAnimationFrame(function() { /* diese Funktion ruft this.ctx so oft auf, wie oft es die Grafikkarte es hergibt (gute Grafikkarte bis zu 25-60 FPS aufgerufen) */
    self.draw();
  });
  }
}