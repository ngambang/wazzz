const jwt    = require('jsonwebtoken'); 

function login_process(req, res) {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const payload = { user: { id: 1 } };
        jwt.sign(payload, process.env.SECRETKEY, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            // res.json({ token }); 
            res.cookie('authToken', token, { httpOnly: true });
            res.redirect('/broadcast');

        });
    } else {
        res.redirect('/');
    }
}

module.exports = {
    login_process
}
