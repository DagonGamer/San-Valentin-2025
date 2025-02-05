let Corazon = document.querySelector("img.Corazon");
let Chincheta = document.querySelector("img.Chincheta");
let Mensaje = document.querySelector("body > p.Mensaje");
let Flecha = document.querySelector("img.Flecha");
let Fondo = document.querySelector("div.Fondo");
let body = document.querySelector("body");
let p = document.querySelector("p");
let canvas = document.querySelector("canvas");
canvas.width = body.offsetWidth;
canvas.height = body.offsetHeight;
let ctx = canvas.getContext("2d");
ctx.fillStyle = "green";
ctx.strokeStyle = "red";

const vel = body.offsetHeight / 2.5;
const fps = 60;
const radioColision = Corazon.offsetWidth * 3 / 8;
const infoEncriptada = "_.n.ÖgçÖ:çnVçn6,.qqçJXçq;UÖDçn5.ne,5çJngç;ò.6:q.Jn6,Ve.6:q.=X/:çqç|,çJnÏ.V5ç5nò.q.ÖÖ.=XÎn:EJn;.nq.gÁ.q5ç6nçnVçn6,.qqç=XnnnnXÎnVçn6,.qqçJX,VÁ;,Öç5çnòUqn.6.n6UV=Xv.6çV:çn6ÁnÏ.VV.rçJXVçnWçg.n5.6VÁ;Ïqçq=X*q.6ngU;Un.6.n6UVJX5.n:q.;.Ö5çn,ÖgçÖ5.6g.Ög,çJXòçqçn;,ne,5çn,q,5,6g.Ög,ç=XsçÁ6çn.Ön;,n6,.qqçnçV.ñq.nVÁ;,Ö,6g.Ög,ç=XXÂqÁ:Un5.Vn6UVnÜnVçn6,.qqçn.6n;,neUrJXg¿V,5çn5.nòç5q.JX;.V,ÓVÁçn5.n;ç5q.=XÎn;,neUrJXÉÁ.nV.n6UÖqD.nçn:Á6ngÁ;òV,5U6JXÉÁ.n;.nq.gÁ.q5çnçn:D=XXRUÜn6,.Ö:Unçñqç5.g,5UJXçVn6UVnòUqn5.Íçq;.ne.q:.JXçnVçn6,.qqçnçòçg,ñÁçq;.JXçn;,neUrnòçqçnòU5.qn5.g,q:.XÉÁ.nWç6ngçÁ6ç5Un.Ön;DnÁÖçn,Ö;çqg.6,ÏV.nV,;.q.Ög,ç=X";
let desbloquearInfo = key => Descodificar(infoEncriptada, key);

let game = {
    Inmortal: false,
    colisiones: true,
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

// Mierda de iOS

const testDeviceOrientation = () => {
    if (typeof DeviceOrientationEvent !== 'function')
        document.querySelector("p.Version").innerText = 'DeviceOrientationEvent not detected';
    else if (typeof DeviceOrientationEvent.requestPermission !== 'function')
        document.querySelector("p.Version").innerText = 'DeviceOrientationEvent.requestPermission not detected';
    else DeviceOrientationEvent.requestPermission()
        .then(result => document.querySelector("p.Version").innerText = result);
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

    body.addEventListener("click", Iniciable);

}, 100);

// Empezar partida

Iniciable = () => {
    testDeviceOrientation();
    body.requestFullscreen();
    Mensaje.style.animation = "";
    Mensaje.style.opacity = 0;
    Chincheta.style.opacity = 0;
    game.Pausa = false;
    SiguienteProgramacion();

    body.removeEventListener("click", Iniciable);
}

// Función que genera balas

let generarBala = (x, y, ang, movimiento) => {

    if (game.Pausa) return;

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
        x, y, ang, movimiento, bala, centroX, centroY, animada: false
    });

}

// Recalcula la velocidad

window.addEventListener("deviceorientation", e => {

    if (e.alpha != null)
        if (body.offsetHeight > body.offsetWidth) {
            game.xVel = Math.round(e.gamma) / 90 * body.offsetHeight / 30;
            game.yVel = Math.round(e.beta) / 90 * body.offsetHeight / 30;
        } else {
            game.xVel = Math.round(e.beta) / 90 * body.offsetHeight / 30;
            game.yVel = Math.round(-e.gamma) / 90 * body.offsetHeight / 30;
        }
    else acl.start();

    p.innerText = `
        Alfa: ${e.alpha}
        Beta: ${e.beta}
        Gamma: ${e.gamma}
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

    // Dibuja en el canvas
    if (game.colisiones) {
        ctx.clearRect(0, 0, body.offsetWidth, body.offsetHeight);
        for (let bala of game.Balas)
            ctx.fillRect(bala.x - 2, bala.y - 2, 5, 5);
        ctx.beginPath();
        ctx.ellipse(game.xPos, game.yPos, radioColision, radioColision, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Comprueba colisiones
    if (!game.Inmortal)
        for (let bala of game.Balas)
            if (distancia(bala.x, bala.y, game.xPos, game.yPos) < radioColision) {
                game.Pausa = true;
                game.Balas = [];
                Corazon.style.zIndex = 50;
                Corazon.style.transition = "all 1s";
                Fondo.style.opacity = 1;
                Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
                Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";
                Corazon.style.transform = "scale(2)";
                let Azar = Math.floor(Math.random() * Finales.length);
                document.querySelector("div.Mensajes p.A").innerText = Finales[Azar][0];
                document.querySelector("div.Mensajes p.B").innerText = Finales[Azar][1];
                document.querySelector("div.Mensajes").style.opacity = 1;
                setTimeout(() => document.querySelector("div.Mensajes button").style.opacity = 1, 3000);
            }

}, Math.floor(1000/fps));

// Funciones de movimiento de flecha

let Lineal = (img, bala) => {
        
    let inf = img.getBoundingClientRect();

    if (!bala.animada) {
        bala.antCentroX = inf.x;
        bala.antCentroY = inf.y;
        setTimeout(() =>  {
            bala.parteX = Math.cos((360 - bala.ang) * Math.PI / 180)/fps;
            bala.parteY = Math.sin((360 - bala.ang) * Math.PI / 180)/fps;
            bala.centroX += vel*Math.cos((360 - bala.ang) * Math.PI / 180)*15;
            bala.centroY += vel*Math.sin((360 - bala.ang) * Math.PI / 180)*15;
            img.style.transition = "all 15s linear";
            img.style.left = bala.centroX + "px";
            img.style.top = bala.centroY + "px";
    
            setTimeout(() => {
                img.remove();
                game.Balas = game.Balas.filter(el => el != bala);
            }, 15000);
        }, Math.floor(1000/fps) - 3);
        bala.animada = true;
    }
    bala.x += inf.x - bala.antCentroX;
    bala.y += inf.y - bala.antCentroY;
    bala.antCentroX = inf.x;
    bala.antCentroY = inf.y;
    
}

// Funciones generadoras de flechas

let Sola = (pos = 1, centro = 0.5, suma = 0) => {

    switch (pos) {

        case 0: // Vertical por arriba
            generarBala(body.offsetWidth*centro + suma, 0, 270, Lineal);
            break;

        case 1: // Horizontal por la derecha
            generarBala(body.offsetWidth, centro*body.offsetHeight + suma, 180, Lineal);
            break;

        case 2: // Vertical por abajo
            generarBala(body.offsetWidth*centro + suma, body.offsetHeight, 90, Lineal);
            break;

        case 3: // Horizontal por la izquierda
            generarBala(0, centro*body.offsetHeight + suma, 0, Lineal);
            break;
    }

}

let Flechita = (pos = 1, centro = 0.5, escalones = 5) => {

    Sola(pos, centro);

    setTimeout(FlechitaAux, 100, pos, centro, escalones - 1);

}

let FlechitaAux = (pos, centro, escalones, i = 1) => {

    Sola(pos, centro, Flecha.offsetHeight * i);
    Sola(pos, centro, -Flecha.offsetHeight * i);
    if (i < escalones) setTimeout(FlechitaAux, 100, pos, centro, escalones, i+1)

}

let FlechitaSinCentro = (pos = 1, centro = 0.5, escalones = 6, escalonesOmitidos = 3) =>
    FlechitaAux(pos, centro, escalones, escalonesOmitidos);

let Muro = (pos = 1, centro = 0.5, ancho = 3) => {

    let cont;
    if (pos == 0 || pos == 2) { // Vertical
        let centroParsed = body.offsetWidth * centro;
        cont = Math.floor(Math.max(centroParsed, body.offsetWidth - centroParsed) / Flecha.offsetHeight);
    } else { // Horizontal
        let centroParsed = body.offsetHeight * centro;
        cont = Math.floor(Math.max(centroParsed, body.offsetHeight - centroParsed) / Flecha.offsetHeight);
    }

    for (let i = ancho; i <= cont + 1; i++) {
        Sola(pos, centro, Flecha.offsetHeight * i);
        Sola(pos, centro, -Flecha.offsetHeight * i);
    }
}

let MuroDoble = (posX = 0, posY = 0, centroX = 0.5, centroY = 0.5) => {
    // posX = 0 por arriba, = 1 por abajo
    // posY = 0 por la derecha, = 1 por la izquierda

    let tiempoX = (posY == 0 ? (1 - centroX) * body.offsetWidth : centroX * body.offsetWidth) / vel;
    let tiempoY = (posX == 0 ? centroY * body.offsetHeight : (1 - centroY) * body.offsetHeight) / vel;
    let minimo = Math.min(tiempoX, tiempoY);
    tiempoX -= minimo;
    tiempoY -= minimo;

    setTimeout(Muro, Math.floor(tiempoY * 1000), posY * 2 + 1, centroY);
    setTimeout(Muro, Math.floor(tiempoX * 1000), posX * 2, centroX);
}

let Escalera = (pos = 0, centro = 0.5, alternar = true) => {
    let cont;
    if (pos == 0 || pos == 2) { // Vertical
        centro = body.offsetWidth * centro;
        cont = Math.floor(Math.max(centro - Corazon.offsetHeight * 7 / 8, body.offsetWidth - centro - Corazon.offsetHeight * 7 / 8) / Flecha.offsetHeight);
    } else { // Horizontal
        centro = body.offsetHeight * centro;
        cont = Math.floor(Math.max(centro - Corazon.offsetWidth * 7 / 8, body.offsetHeight - centro - Corazon.offsetWidth * 7 / 8) / Flecha.offsetHeight);
    }
    EscaleraAux(pos, cont, centro, alternar);
}

let EscaleraAux = (pos, cont, centro, alternar, i = 0) => {
    
    let lado = pos + (alternar ? 2 : 0) * (i % 2);

    switch (lado % 4) {

        case 0:
            generarBala(centro - Corazon.offsetWidth * 7 / 8 - Flecha.offsetHeight*(cont-i), 0, 270, Lineal);
            generarBala(centro + Corazon.offsetWidth * 7 / 8 + Flecha.offsetHeight*(cont-i), 0, 270, Lineal);
            break;

        case 1: 
            generarBala(body.offsetWidth, centro + Corazon.offsetHeight * 7 / 8 + Flecha.offsetHeight*(cont-i), 180, Lineal);
            generarBala(body.offsetWidth, centro - Corazon.offsetHeight * 7 / 8 - Flecha.offsetHeight*(cont-i), 180, Lineal);
            break;

        case 2:
            generarBala(centro + Corazon.offsetWidth * 7 / 8 + Flecha.offsetHeight*(cont-i), body.offsetHeight, 90, Lineal);
            generarBala(centro - Corazon.offsetWidth * 7 / 8 - Flecha.offsetHeight*(cont-i), body.offsetHeight, 90, Lineal);
            break;

        case 3:
            generarBala(0, centro - Corazon.offsetHeight * 7 / 8 - Flecha.offsetHeight*(cont-i), 0, Lineal);
            generarBala(0, centro + Corazon.offsetHeight * 7 / 8 + Flecha.offsetHeight*(cont-i), 0, Lineal);
            break;

    }

    if ( i < cont ) setTimeout(EscaleraAux, 100, pos, cont, centro, alternar, i + 1);
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

let Circulo = (centroX = 0.5, centroY = 0.5, balas = 10, radio = 7 / 8, anguloRedundante = 0) => {
    centroX *= body.offsetWidth;
    centroY *= body.offsetHeight;

    let distanciaAparicion = Math.max(distancia(centroX, centroY, 0, 0),
                                distancia(centroX, centroY, body.offsetWidth, 0),
                                distancia(centroX, centroY, body.offsetWidth, body.offsetHeight),
                                distancia(centroX, centroY, 0, body.offsetHeight));
    
    for (let i = 0; i < balas; i++) {
        let ang = 360 / balas * i + anguloRedundante;
        let rad = ang * Math.PI / 180;
        let x = centroX;
        let y = centroY;
        x += Math.cos(-rad)*distanciaAparicion;
        y += Math.sin(-rad)*distanciaAparicion;
        x += Math.cos(-rad+Math.PI/2)*radio*Corazon.offsetHeight;
        y += Math.sin(-rad+Math.PI/2)*radio*Corazon.offsetHeight;

        generarBala(x, y, (ang + 180) % 360, Lineal);
    }

}

// Ganar

let Ganar = () => {
    Fondo.style.opacity = 1;
    game.Pausa = true;
    game.Balas = [];
    Corazon.style.zIndex = 50;
    Corazon.style.transition = "all 1s";
    Fondo.style.opacity = 1;
    Corazon.style.top = ( ( body.offsetHeight - Corazon.offsetHeight ) / 2 ) + "px";
    Corazon.style.left = ( ( body.offsetWidth - Corazon.offsetWidth ) / 2 ) + "px";
    Corazon.style.transform = "scale(2)";
    document.querySelector("div.Ganado").style.opacity = 1;
}

// Funcion que sigue la programacion

let SiguienteProgramacion = (idx = 0) => {
    if (game.Pausa) return;
    Programacion[idx][0](...Programacion[idx].slice(2));
    if (Programacion[idx+1]) setTimeout(SiguienteProgramacion, Programacion[idx+1][1], idx+1);
}

// Programación del juego

let Programacion = [
    [Sola, 0], // Primera flecha dura
    [Flechita, 5000], // Olita derecha
    [Escalera, 3000, 1, 0.5, false], // Escalera derecha
    [Escalera, 3000, 0, 0.35, false], // Escalera arriba
    [Flechita, 4000, 1, 0.5, 6], // Punta de Flecha
    [FlechitaSinCentro, 2000, 1, 0.5, 15, 3],
    [Escalera, 1000, 1, 0.75, false], // Parte interesante de escaleras
    [Escalera, 2000, 1, 0.5, false],
    [Escalera, 1000, 1, 0.25, false],
    [Escalera, 2000, 1, 0.75, false],
    [Muro, 6000, 0, 0.5], // Parte interesante de muros verticales
    [Muro, 1500, 0, 0.75],
    [Muro, 1500, 0, 0.25],
    [MuroDoble, 1500],
    [Circulo, 3500, 0.5, 0.5, 15, 1, 0],
    [Circulo, 0, 0.5, 0.5, 15, -1, 0]
    [Ganar, 10000]
]

let Finales = [
    ["Te enamoraste de Alex...", "¿Cómo pudiste enamorarte de Alex? Lo veía difícil, pero parece que ha sido así..."],
    ["Te enamoraste de Fran...", "¿Cómo pudiste enamorarte de Fran? Te meterá una puñala' si se entera..."],
    ["Te enamoraste de tu padre...", "¿Cómo pudiste enamorarte de tu padre? Es tu pu** padre, psicópata."],
    ["Te enamoraste de Paco...", "¿Cómo pudiste enamorarte de un coche? Es caro y hay que mantenerlo."],
    ["Te enamoraste de Bullejos...", "¿Cómo pudiste enamorarte de Bullejos? Él era mío... :("],
    ["Te enamoraste de una manzana...", "¿Cómo pu-, normal, siendo vegetariana... Aunque seguro que te la comes entera."]
]

// Reinicio del juego

document.querySelector("div.Mensajes button").onclick = () => {
    Corazon.style.zIndex = 10;
    Corazon.style.transition = "";
    Fondo.style.opacity = 0;
    Corazon.style.transform = "";
    document.querySelector("div.Mensajes").style.opacity = 0;
    Mensaje.style.animation = "infinite linear alternate 1s parpadeo";
    Mensaje.style.opacity = 1;
    document.querySelector("div.Mensajes button").style.opacity = 0;
    Chincheta.style.opacity = 1;
    setTimeout(() => body.addEventListener("click", Iniciable), 500);
}

// Funciones auxiliares

let distancia = (x1, y1, x2, y2) => 
    Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));

// Acelerómetro en caso de no tener Giroscopio

const acl = new Accelerometer({ frequency: 10 });
acl.addEventListener("reading", () => {
    p.innerText = `
        X: ${acl.x}
        Y: ${acl.y}
        Z: ${acl.z}
    `;

    if (body.offsetHeight < body.offsetWidth) {
        game.xVel = -acl.y / 15 * body.offsetHeight / 30;
        game.yVel = -acl.x / 15 * body.offsetHeight / 30;
    } else {
        game.xVel = acl.x / 15 * body.offsetHeight / 30;
        game.yVel = -acl.y / 15 * body.offsetHeight / 30;
    }
});
