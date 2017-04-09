
//load required modules
var pfio = require("piface");

//initialize GPIO
pfio.init();



function schaltgleis()
{
  do
    {
      console.log('Zug ist nicht auf dem Schaltgleis'); //shows state on console
			if (pfio.digital_read(4) === 1) //if the train is at the right position input = 1
			{
				break; // while breakout
			}
    }

  while(pfio.digital_read(4)==0) // while the train is not at the rigth position input = 0

	console.log('Zug ist auf dem Schaltgleis'); //shows state on console
}
 schaltgleis(); //test funvtion (do not use this part in your code)
