let canvas; 
let ctx; /* Objekt, das dafür verantwortlich ist, um auf das Canvas zu malen */
let character = new Image(); 


/* die Init-Methode soll letztendlich auf das Canvas zugreifen und eine Methode aufrufen, die unser Canvas an eine Variable bindet */
function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d'); /* mit der Variable ctx Funktionen aufrufen: Bsp. drawImage */

    
    character.src = '../img/2_character_pepe/2_walk/W-21.png';
    
    ctx.drawImage(character, 20, 20, 50, 150); /* erste beiden Zahlen Koordinaten, dann Breite, dann Höhe */
}