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
