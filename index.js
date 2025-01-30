let Corazon = document.querySelector("img.Corazon");
let Chincheta = document.querySelector("img.Chincheta");
let Mensaje = document.querySelector("body > p.Mensaje");
let Flecha = document.querySelector("img.Flecha");
let Fondo = document.querySelector("div.Fondo");
let body = document.querySelector("body");
let p = document.querySelector("p");

const vel = body.offsetHeight / 50;

let game = {
    Inmortal: false,
    xPos: 0,
    yPos: 0,
    maxXPos: 0,
    maxYPos: 0,
    minXPos: 0,
    minYPos: 0,
    xVel: 0,
    yVel: 0,
    Pausa: true,
    Balas: []
}

// Centra las imágenes del principio

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

// Recentra las imágenes del principio

setTimeout( () => {

    Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
    Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";

    Chincheta.style.top = ( ( body.offsetHeight - Chincheta.offsetHeight ) / 2 - body.offsetHeight / 30 ) + "px";
    Chincheta.style.left = ( ( body.offsetWidth - Chincheta.offsetWidth ) / 2 + body.offsetWidth / 60 ) + "px";

    game.maxXPos = body.offsetWidth - Corazon.offsetWidth / 2;
    game.maxYPos = body.offsetHeight - Corazon.offsetHeight / 2;
    game.minXPos = Corazon.offsetWidth / 2;
    game.minYPos = Corazon.offsetHeight / 2;
    game.xPos = (game.maxXPos + game.minXPos) / 2;
    game.yPos = (game.maxYPos + game.minYPos) / 2;

    body.onclick = () => {
        Mensaje.style.animation = "";
        Mensaje.style.opacity = 0;
        Chincheta.remove();
        game.Pausa = false;
        SiguienteProgramacion();

        body.onclick = () => {};
        body.ontouchmove = e => {
            game.xPos = e.touches[0].clientX;
            game.yPos = e.touches[0].clientY;
        }
    }

}, 100);

// Función que genera balas

let generarBala = (x, y, ang, movimiento) => {

    let bala = document.createElement("img");
    bala.src = "src/Flecha Comprimida.png";
    bala.className = "Flecha";
    body.appendChild(bala);

    // Posiciona la bala renderizada

    let rad = ang * Math.PI / 180;
    let hipotenusa1 = 7/16*Flecha.offsetWidth;
    let hipotenusa2 = 3/50*Flecha.offsetHeight;
    let centroX = x;
    let centroY = y;

    centroY += Math.sin(rad)*hipotenusa1;
    centroX -= Math.cos(rad)*hipotenusa1;
    centroY -= Math.sin(Math.PI/2-rad)*hipotenusa2;
    centroX -= Math.cos(Math.PI/2-rad)*hipotenusa2;
    centroX -= Flecha.offsetWidth/2;
    centroY -= Flecha.offsetHeight/2;

    bala.style.top = centroY + "px";
    bala.style.left = centroX + "px";
    bala.style.transform = "rotate(" + (360-ang) + "deg)";

    game.Balas.push({
        x, y, ang, movimiento, bala, centroX, centroY, cont: 50
    });

}

// Recalcula la velocidad

window.addEventListener("deviceorientation", e => {

    if (body.offsetHeight > body.offsetWidth) {
        game.xVel = Math.round(e.gamma) / 90 * body.offsetHeight / 30;
        game.yVel = Math.round(e.beta) / 90 * body.offsetHeight / 30;
    } else {
        game.xVel = Math.round(e.beta) / 90 * body.offsetHeight / 30;
        game.yVel = Math.round(-e.gamma) / 90 * body.offsetHeight / 30;
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

// Recalcula posiciones y renderiza

setInterval(() => {

    if (game.Pausa) return;

    // Calcula posición del corazón
    game.yPos = Math.max(Math.min(game.yVel + game.yPos, game.maxYPos), game.minYPos);
    game.xPos = Math.max(Math.min(game.xVel + game.xPos, game.maxXPos), game.minXPos);

    Corazon.style.top = (game.yPos - game.minYPos) + "px";
    Corazon.style.left = (game.xPos - game.minXPos) + "px";

    // Calcula posición de las balas
    for (let bala of game.Balas)
        bala.movimiento(bala.bala, bala);

    // Comprueba colisiones
    if (!game.Inmortal)
        for (let bala of game.Balas)
            if (distancia(bala.x, bala.y, game.xPos, game.yPos) < Corazon.offsetHeight / 4) {
                game.Pausa = true;
                Corazon.style.zIndex = 50;
                Corazon.style.transition = "all 1s";
                setTimeout(() => {
                    Fondo.style.opacity = 1;
                    Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
                    Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";
                    Corazon.style.transform = "scale(2)";
                    document.querySelector("div.Mensajes").style.opacity = 1;
                }, 1000);
            }

}, 40);

// Funciones de movimiento de flecha

let Lineal = (img, bala) => {
	bala.x += vel*Math.cos((360 - bala.ang) * Math.PI / 180);
	bala.centroX += vel*Math.cos((360 - bala.ang) * Math.PI / 180);
	bala.y += vel*Math.sin((360 - bala.ang) * Math.PI / 180);
	bala.centroY += vel*Math.sin((360 - bala.ang) * Math.PI / 180);
	img.style.left = bala.centroX + "px";
	img.style.top = bala.centroY + "px";
    bala.cont--;

    if (bala.cont < 0)
        if (bala.centroX > body.offsetWidth + Flecha.offsetWidth ||
            bala.centroX < -Flecha.offsetWidth*2 ||
            bala.centroY > body.offsetHeight + Flecha.offsetWidth ||
            bala.centroY < -Flecha.offsetWidth*2) {
                img.remove();
                game.Balas = game.Balas.filter(el => el != bala);
        }
}

// Funciones generadoras de flechas

let Escalera = (pos = 1, centro = body.offsetHeight / 2) => {
    let cont;
    if (pos == 1) // Vertical
        cont = Math.floor(Math.max(centro - Corazon.offsetHeight * 7 / 8, body.offsetHeight - centro - Corazon.offsetHeight * 7 / 8) / Flecha.offsetHeight);
    else cont = Math.floor(Math.max(centro - Corazon.offsetWidth * 7 / 8, body.offsetWidth - centro - Corazon.offsetWidth * 7 / 8) / Flecha.offsetHeight);
    EscaleraAux(pos, cont, centro);
}

let EscaleraAux = (pos, cont, centro, i = 0) => {
    if (pos == 1) // Vertical
        if (i % 2 == 0) {
            generarBala(0, centro - Corazon.offsetHeight * 7 / 8 - Flecha.offsetHeight*(cont-i), 0, Lineal);
            generarBala(0, centro + Corazon.offsetHeight * 7 / 8 + Flecha.offsetHeight*(cont-i), 0, Lineal);
        } else {
            generarBala(body.offsetWidth, centro + Corazon.offsetHeight * 7 / 8 + Flecha.offsetHeight*(cont-i), 180, Lineal);
            generarBala(body.offsetWidth, centro - Corazon.offsetHeight * 7 / 8 - Flecha.offsetHeight*(cont-i), 180, Lineal);
        }
    else if (i % 2 == 0) { // Horizontal
            generarBala(centro - Corazon.offsetWidth * 7 / 8 - Flecha.offsetHeight*(cont-i), 0, 270, Lineal);
            generarBala(centro + Corazon.offsetWidth * 7 / 8 + Flecha.offsetHeight*(cont-i), 0, 270, Lineal);
        } else {
            generarBala(centro + Corazon.offsetWidth * 7 / 8 + Flecha.offsetHeight*(cont-i), body.offsetHeight, 90, Lineal);
            generarBala(centro - Corazon.offsetWidth * 7 / 8 - Flecha.offsetHeight*(cont-i), body.offsetHeight, 90, Lineal);
        }
    if ( i < cont ) setTimeout(EscaleraAux, 100, pos, cont, centro, i + 1);
}

let Bloques = (pos = 1) => {
    if (pos == 1) { // Vertical
        let cont = body.offsetWidth / Flecha.offsetHeight;
        for (i = 0; i < cont; i++)
            generarBala(Flecha.offsetHeight*i, (Math.floor(i/5) % 2) * body.offsetHeight, 270 - 180 * (Math.floor(i/5) % 2), Lineal);
    } else { // Horizontal
        let cont = body.offsetHeight / Flecha.offsetHeight;
        for (i = 0; i < cont; i++)
            generarBala((Math.floor(i/5) % 2) * body.offsetWidth, Flecha.offsetHeight*i, 180 * (Math.floor(i/5) % 2), Lineal);
    }
}

let Octogono = (centroX = body.offsetWidth/2, centroY = body.offsetHeight/2, apotema = Corazon.offsetHeight * 7 / 8) => {
    let distanciaAparicion = Math.max(distancia(centroX, centroY, 0, 0), distancia(centroX, centroY, body.offsetWidth, 0), distancia(centroX, centroY, body.offsetWidth, body.offsetHeight), distancia(centroX, centroY, 0, body.offsetHeight))
    generarBala(centroX + 0.41421 * apotema - distanciaAparicion, centroY - apotema, 0, Lineal);
    generarBala(centroX + apotema - 0.7071 * distanciaAparicion, centroY - 0.41421 * apotema - 0.7071 * distanciaAparicion, 315, Lineal);
    generarBala(centroX + apotema, centroY + 0.41421 * apotema - distanciaAparicion, 270, Lineal);
    generarBala(centroX + 0.41421 * apotema + 0.7071 * distanciaAparicion, centroY + apotema - 0.7071 * distanciaAparicion, 225, Lineal);
    generarBala(centroX - 0.41421 * apotema + distanciaAparicion, centroY + apotema, 180, Lineal);
    generarBala(centroX - apotema + 0.7071 * distanciaAparicion, centroY + 0.41421 * apotema + 0.7071 * distanciaAparicion,135, Lineal)
    generarBala(centroX - apotema, centroY - 0.41421 * apotema + distanciaAparicion, 90, Lineal);
    generarBala(centroX - 0.41421 * apotema - 0.7071 * distanciaAparicion, centroY - apotema + 0.7071 * distanciaAparicion, 45, Lineal)
}

// Funcion que sigue la programacion

let SiguienteProgramacion = (idx = 0) => {
    Programacion[idx][0](...Programacion[idx].slice(2));
    if (Programacion[idx+1]) setTimeout(SiguienteProgramacion, Programacion[idx+1][1], idx+1);
}

// Programación del juego

let Programacion = [
    [Escalera, 0],
    [Escalera, 5000, 0, body.offsetWidth / 2],
    [Escalera, 5000, 1, game.minXPos],
    [Escalera, 5000, 0, game.minXPos],
    [Bloques, 5000],
    [Bloques, 5000, 0],
    [Octogono, 5000]
]

// Funciones auxiliares

let distancia = (x1, y1, x2, y2) => 
    Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));