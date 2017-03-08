// Das Realais welches mit der Antriebsschiene verbunden ist ausschalten.
var pfio = require("piface");
pfio.init();
pfio.digital_write(0, 0);
