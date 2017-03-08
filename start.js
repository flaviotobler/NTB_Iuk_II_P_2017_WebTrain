
// Das Realais welches mit der Antriebsschiene verbunden ist einschalten.
var pfio = require("piface");
pfio.init();
pfio.digital_write(o, 1);
