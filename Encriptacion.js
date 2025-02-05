const Caracteres = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "#",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "+",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "$", "%", "?", "¿", "=", "(", ")", "&", "€", "¡", "<", ">", ":", "-", "_", "*", "/",
    "|", ":", ";", ",", ".", "ç", "í", "ó", "á", "é", "ú", "à", "è", "ì", "ò", "ù", "ä", "ë", "ï", "ö", "ü", "â", "ê", "î", "ô", "û", "ą", "ę",
    "į", "ø", "Á", "É", "Í", "Ó", "Ú", "À", "È", "Ì", "Ò", "Ù", "Ä", "Ë", "Ï", "Ö", "Ü", "Â", "Ê", "Î", "Ô", "Û", " ", "\n"
];

const Random = (PrimNum = 0) => {

    let num = PrimNum;

    num *= 102;
    num += 54;
    num /= 503;
    num *= 786 + PrimNum;
    num /= 435;
    num = num % 1;
    num *= 2;
    num = num % 1;

    return num;

}

let CreateCharacterArray = (num = 0) => {

    let BufferArr = [...Caracteres];
    let RandomNumber = Random(num);
    let arr = [];

    for (let i = Caracteres.length; i > 0; i--) {

        let idx = Math.floor(RandomNumber * i);
        arr.push(...BufferArr.splice(idx, 1));
        RandomNumber = Random(RandomNumber);

    }

    return arr;

}

let Descodificar = (Nombre, KeyEncriptada) => {

    let NumberKey = Array.from(KeyEncriptada)
                            .map( el => ( Caracteres.indexOf(el) - 12 ) < 0 ?
                                    Caracteres.indexOf(el) - 12 + Caracteres.length :
                                    Caracteres.indexOf(el) - 12 )
                            .reduce((GlobVal, el, idx) => GlobVal + el * Math.pow(Caracteres.length, idx), 0);

    let CarArr = CreateCharacterArray(NumberKey);
    
    let newName = [];
    for (let o = 0; o < Nombre.length; o++) {

        let idx = ( CarArr.indexOf(Nombre[o]) - NumberKey - Math.ceil( o * Random( o + NumberKey ) ) ) % Caracteres.length;
        while ( idx < 0 ) idx += Caracteres.length;

        newName[o] = Caracteres[ idx ];

    }

    return newName.join("");

}