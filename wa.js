require('dotenv').config();
const { Client , LocalAuth ,MessageMedia,Buttons, List } = require('whatsapp-web.js');
const connection = require("./db");

const client = new Client({
    authStrategy: new LocalAuth(),
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'        
        ]
    }
}); 

async function initializeWa() {
    
    client.on('message', async (message) => {
        if(message.type == 'chat' && !message.from.includes("status@broadcast")){
    
            let keyword = [message.body];
            let query    = "select * from auto where keyword = ? and tipe = 'Exact Match'";
            let newResult   = [];
            await connection.query(query, keyword, async (err, result) => {
                if (err) {
                    console.log('Error executing SQL query:', err);
                }
                newResult = result;
                // cari yang mengandung
                if(!result){
                    keyword = [`%${message.body}%`];
                    query = "select * from auto where keyword like ? and tipe = 'Contain'"; 

                    await connection.query(query, keyword, (err, result2) => {
                        if (err) {
                            console.error('Error executing SQL query:', err);
                        }
        
                        newResult = result2;
                    })
                }
    
                if(newResult.length > 0){
                    newResult.forEach(async (msg) => {
                        const waktuTunggu = Math.floor(Math.random() * (process.env.SENDER_MAX - 1000 + 1)) + 1000;
                        setTimeout(async () => {
                            switch (msg['tipe_response']) {
                                case "Text":
                                    try {
                                        if(msg['media'] != null && msg['media'] != ""){
                                            const media = await MessageMedia.fromFilePath('./public/media/'+msg['media']);
                                            await client.sendMessage(message.from, media, { caption: msg['response'] });
                                        }else{
                                            await client.sendMessage(message.from, msg['response']);
                                        }
        
                                    } catch (error) {
                                        console.log(error)
                                    }
                                break;
                                case "Button":
                                    try {
                                        if(msg['media'] != null && msg['media'] != ""){
                                            const media = await MessageMedia.fromFilePath('./public/media/'+msg['media']);
                                            await client.sendMessage(message.from, media,{ caption: msg['response'] });
                                        }
                                        
                                        let listTobutton = JSON.parse(msg['list']).map(item => ({ body: item }));; 
                                        let button       = new Buttons(msg['response'], listTobutton, '', process.env.FOOTER_WA);
                                        await client.sendMessage(message.from, button);
                                        
                                    } catch (error) {
                                        console.log(error)
                                    }
                                    
        
                                break;
                                case "List":
                                    try {
                                        
                                        if(msg['media'] != null && msg['media'] != ""){
                                            const media = await MessageMedia.fromFilePath('./public/media/'+msg['media']);
                                            await client.sendMessage(message.from, media,{ caption: msg['response'] });
                                        }
                                        let listTolist = JSON.parse(msg['list']).map(item => ({ title: item }));
                                        let list       = new List(msg['response'],'Menu',[{ title: 'List Pilihan', rows: listTolist }], '', process.env.FOOTER_WA);
                                        await client.sendMessage(message.from, list);
        
                                    } catch (error) {
                                        console.log(error)
                                    }
        
                                break;
                            
                                default:
                                    break;
                            }
                        }, waktuTunggu);
                    });
                    
                }
        
            });
        }
       
    
    
    
    });
    
    client.initialize();

    client.on('disconnected',async  (reason) => {
        // Destroy and reinitialize the client when disconnected
        try {
            await client.destroy();
            await client.initialize();
        } catch (error) {
            console.log(error)
        }
    });
}

async function loginWhatsApp(qrCodeCallback) {
    client.on('qr', (qrCode) => {
        qrCodeCallback({msg:"scan-qr",qr:qrCode,data:""});
    });


    client.on('loading_screen', (percent, message) => {
        qrCodeCallback({msg:"loading-wa",qr:"",data: percent});

    });

    client.on('authenticated', () => {
        qrCodeCallback({msg:"wes-login",qr:"",data: ""});

    });

    client.on('ready', () => {
        qrCodeCallback({msg:"wes-ready","qr":"",data:client.info});
    });


}

async function sendWhatsapp (msg = "" ,phone = "", media = false){
    if(media){
        const media = await MessageMedia.fromUrl(media);
        await client.sendMessage(phone+"@c.us", media, { caption: msg });
    }else{
        await client.sendMessage(phone+"@c.us", msg);
    }


}

module.exports = {
    loginWhatsApp,
    initializeWa,
    sendWhatsapp
};
