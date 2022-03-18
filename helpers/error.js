module.exports.sendError = (error, status, res) => {
    res.status(status).send('ERROR: ' + error);
}