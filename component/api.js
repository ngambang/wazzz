const { sendWhatsapp }  = require("../wa");

async function apiBroadcast(req , res) {
        const pesan = req.body.pesan;
        const hp = req.body.hp;
        send( splitWa(hp) , async (phone)=>{
            try {
                await sendWhatsapp(pesan,phone);
            } catch (error) {
                console.log(error)
            }
        })
        res.send("tunggu akan diproses");
}

function splitWa(hp) {
    return hp.split(',').map(number => number.trim());
  }

function send(phoneNumbers, callback) {
    const waktuTunggu = Math.floor(Math.random() * (process.env.SENDER_MAX - 1000 + 1)) + 1000;

    let currentIndex = 0;
  
    function runNextNumber() {
      if (currentIndex < phoneNumbers.length) {
        const phoneNumber = phoneNumbers[currentIndex];
        if (typeof callback === 'function') {
          callback(phoneNumber);
        }
        currentIndex++;
        setTimeout(runNextNumber, waktuTunggu);
      }
    }
  
    runNextNumber();
  }
  

module.exports = {apiBroadcast}