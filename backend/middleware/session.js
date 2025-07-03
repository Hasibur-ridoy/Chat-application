const {Login} = require('../models');

async function session(req, res, next) {
    const sessionId = req.headers['x-auth-token'];

    if (!sessionId) {
        return res.status(401).json({error: 'missing session ID'});
    }

    const validSession = await Login.findOne({ where: {id: sessionId}});
    if (!validSession) {
        return res.status(401).json({error: 'invalid session ID'});
    }
    console.log('Valid session ID:', validSession.user_id);
    req.user = validSession.user_id;
    next();
};

module.exports = session;