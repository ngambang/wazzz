require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const appRoutes = require('./routes');
const { initializeWa,loginWhatsApp } = require('./wa');
initializeWa();
const app = express();
const server = http.createServer(app); 
const io = socketIo(server); 
let   me = {};
io.on('connection', async (socket) => {

    function CheckLogin(msg){
        switch (msg['msg']) {
            case 'scan-qr':
                socket.emit("qr-code",msg['qr']);
                break;
            case 'wes-login':
                socket.emit("wes-login","wes login");
                break;
            case 'wes-ready':
                socket.emit("wes-ready",JSON.stringify(msg));
                break;
            case 'loading-wa':
                socket.emit("loading-wa",msg);
                break;
            default:
                break;
        }
    }
    
    if(me){
        CheckLogin(me)
    }
    
    await loginWhatsApp(msg=>{
        me = msg;
       CheckLogin(msg)
    });


});


app.set('view engine', 'ejs'); // Menggunakan EJS sebagai template engine
app.set('views', path.join(__dirname, 'public')); // Menentukan direktori tampilan (views)
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', appRoutes);

const PORT = process.env.PORT ; 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});
