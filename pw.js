<<<<<<< HEAD
const PASSWORD = "IUK123";
const USERNAME = "root";
const CAMERAIP = "192.168.0.90";
const PORT = 3000;

const POS1  = {
    x : 100,
    y : 100,
    zoom: 1,
    focus: 0
}

const POS2  = {
    x : 150,
    y : 30,
    zoom: 1,
    focus: 0
}


module.exports = {
    PASSWORD: PASSWORD,
    USERNAME: USERNAME,
    CAMERAIP: CAMERAIP,
    PORT: PORT,
    POS1: POS1,
    POS2: POS2
};
=======
/*
Modul, das vom index.js eingebunden wird.
Hier sind alle nötigen Daten für die Verbindung zur Kamera und andere Angaben wie nodejs Serverport eingetragen.
Wenn die Kamera ins NTB-Netzwerk verlegt wird, müssen hier nur noch die angaben angepasst werden
*/

const PASSWORD = "IUK123";
const USERNAME = "root";
const CAMERAIP = "192.168.0.90";
const PORT = 3000;


module.exports = {
    PASSWORD: PASSWORD,
    USERNAME: USERNAME,
    CAMERAIP: CAMERAIP,
    PORT: PORT
};
>>>>>>> 12a4b3c0b6c0face3ff029c2d609ff27e7b205a0
