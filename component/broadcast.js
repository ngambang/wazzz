
function getBroadcastList(req, res) {
    res.render('broadcast', { title: 'Broadcast' });
}


module.exports = {
    getBroadcastList
}