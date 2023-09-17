const connection   = require("../db");

function getReplyList(req , res ) {

    connection.query('SELECT * FROM auto order by id desc', (err, results) => {
        if (err) {
            console.log('Error executing SQL query:', err);
            return;
        }
        res.render('auto-reply', { title: 'Auto Reply' , data_auto : JSON.stringify(results)});
    });
}   


function postReply(req, res) {
    const tipe = req.body.tipe;
    const keyword = req.body.keyword;
    const response = req.body.response;
    const tipe_response = req.body.tipe_response;
    const buttons = tipe_response !== "Text" ? req.body.button : [];
    
    const uploadedFile = req.file;

    let sql = 'INSERT INTO auto (tipe, keyword, response, media , tipe_response , list) VALUES (?, ?, ?, ? ,? ,?)';
    let values = [tipe, keyword, response, null ,tipe_response,JSON.stringify(buttons)]; 

    if (uploadedFile) {
        values[3] = uploadedFile.filename;
    }

    if(tipe !== "" && keyword !== "" && response !== "" ){
        
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.log('Error executing SQL query:', err);
                return res.send('Error saat menyimpan data ke database.');
            }
            res.redirect('/auto-reply');
        });


    }else{
        res.redirect('/auto-reply');

    }

}

function deleteReply(req , res ) {

    const id = req.params.id; // Mendapatkan ID dari parameter URL
    const query = 'DELETE FROM auto WHERE id = ?'; // Query SQL untuk menghapus data berdasarkan ID

    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).json({ message: 'Terjadi kesalahan dalam menghapus data' });
        } else {
            res.redirect('/auto-reply');
        }
    });
}   



module.exports = {
    getReplyList,
    postReply,
    deleteReply
}