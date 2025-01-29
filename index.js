let Corazon = document.querySelector("img.Corazon");
let Chincheta = document.querySelector("img.Chincheta");
let Mensaje = document.querySelector("img.Mensaje");
let body = document.querySelector("body");
let p = document.querySelector("p");
let game = {
    xPos: 0,
    yPos: 0,
    maxXPos: 0,
    maxYPos: 0,
    xVel: 0,
    yVel: 0,
    Pausa: true
}

// Centrar corazón y chincheta

Corazon.onload = () => {
    Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
    Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";

    game.maxXPos = body.offsetWidth - Corazon.offsetWidth;
    game.maxYPos = body.offsetHeight - Corazon.offsetHeight;
    game.xPos = game.maxXPos / 2;
    game.yPos = game.maxYPos / 2;
}

Chincheta.onload = () => {
    Chincheta.style.top = ( ( body.offsetHeight - Chincheta.offsetHeight ) / 2 - body.offsetHeight / 30 ) + "px";
    Chincheta.style.left = ( ( body.offsetWidth - Chincheta.offsetWidth ) / 2 + body.offsetWidth / 60 ) + "px";
}

Mensaje.onload = () => {
    Mensaje.style.top = ( ( body.offsetHeight - Mensaje.offsetHeight ) / 2 + body.offsetHeight / 5 ) + "px";
    Mensaje.style.left = ( ( body.offsetWidth - Mensaje.offsetWidth ) / 2 ) + "px";
}

setTimeout( () => {

    Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
    Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";

    Chincheta.style.top = ( ( body.offsetHeight - Chincheta.offsetHeight ) / 2 - body.offsetHeight / 30 ) + "px";
    Chincheta.style.left = ( ( body.offsetWidth - Chincheta.offsetWidth ) / 2 + body.offsetWidth / 60 ) + "px";

    Mensaje.style.top = ( ( body.offsetHeight - Mensaje.offsetHeight ) / 2 + body.offsetHeight / 5 ) + "px";
    Mensaje.style.left = ( ( body.offsetWidth - Mensaje.offsetWidth ) / 2 ) + "px";

    game.maxXPos = body.offsetWidth - Corazon.offsetWidth;
    game.maxYPos = body.offsetHeight - Corazon.offsetHeight;
    game.xPos = game.maxXPos / 2;
    game.yPos = game.maxYPos / 2;

    body.onclick = () => {
        Mensaje.remove();
        Chincheta.remove();
        game.Pausa = false;
    }

}, 100);

window.addEventListener("deviceorientation", e => {

    if (!game.Pausa) {
        game.xVel = Math.round(e.gamma) / 90 * body.offsetHeight / 30;
        game.yVel = Math.round(e.beta) / 90 * body.offsetHeight / 30;
    }

    p.innerText = `
        Alfa: ${e.alpha}
        Beta: ${e.beta}
        Gamma: ${e.gamma}
        Pausa: ${game.Pausa}
        xVel: ${game.xVel}
        yVel: ${game.yVel}
        xPos: ${game.xPos}
        yPos: ${game.yPos}
    `

}, true);

setInterval(() => {

    game.xPos = Math.max(Math.min(game.xVel + game.xPos, game.maxXPos), 0);
    game.yPos = Math.max(Math.min(game.yVel + game.yPos, game.maxYPos), 0);

    Corazon.style.top = game.yPos + "px";
    Corazon.style.left = game.xPos + "px";

}, 16);