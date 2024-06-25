const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {
        const payload = { uid }

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                // No se creo el token
                reject('No se pudo generar token');
            } else {
                // Token creado
                resolve(token);
            }
        })
    });
}

const comprobarJWT = (token = '') => {
    try {
        const { uid } = jwt.verify(token, process.env.JWT_KEY)
        return {
            ok: true,
            uid: uid,
        };
    } catch (error) {
        return {
            ok: false,
            msg: 'Token no valido'
        };
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}