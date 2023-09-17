const jwt = require('jsonwebtoken');

function requireToken(req, res, next) {
    const token = req.cookies.authToken;

    // Jika token tidak ada, kembalikan respons 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.SECRETKEY);

        // Tambahkan payload token ke objek permintaan (req)
        req.user = decoded.user;

        // Buat token baru dengan payload yang sama dan atur waktu kedaluwarsa (misalnya, 1 jam)
        const newPayload = { user: { id: decoded.user.id } };
        jwt.sign(newPayload, process.env.SECRETKEY, { expiresIn: '1h' }, (err, newToken) => {
            if (err) throw err;
            req.user.token = newToken; // Perbarui token dalam objek permintaan (req)
            next(); // Lanjutkan ke rute berikutnya
        });
    } catch (err) {
        res.redirect('/');
    }
}

module.exports = {requireToken};
