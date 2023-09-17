const express = require('express');
const router = express.Router();
const { login_process } = require("./component/login");
const { getReplyList , postReply , deleteReply } = require("./component/autoReply");
const { getBroadcastList } = require("./component/broadcast");
const { whatsapp } = require("./component/whatsapp");
const {apiBroadcast } = require("./component/api");
const { requireToken } = require('./middleware'); 
const multer = require('multer'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/media/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => res.render('login', { title: 'Home Page' }));

// login
router.post('/login', login_process);

// broadcast client
router.get('/broadcast', requireToken,getBroadcastList );

// auto reply
router.get('/auto-reply', requireToken, getReplyList);
router.get('/auto-reply/hapus/:id', requireToken, deleteReply);
router.post('/auto-reply',[requireToken, upload.single('file')],postReply);

// whatsapp client
router.get('/whatsapp', requireToken, whatsapp);

// api 
router.post('/api/broadcast',apiBroadcast);

module.exports = router;
