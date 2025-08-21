/*
Libreria para gestionar los tokens

*/

import jwt from 'jsonwebtoken';

export const generarToken = (payload, vida) => {
    const options = {
        expiresIn: vida,
    };
    return jwt.sign(payload, process.env.SALT , options);
}

/* middleware para autenticar los token */

export const authMiddleware = (req, res, next) => {
    try {
        //token valido desde la peticion request

        const token = req.headers.authorization;

        console.log("Token recibido:", token);

        //validar el token

        if (!token) {
            throw new Error("Token invalido o no se ha proporcionado un token");
        }

        //comparar el token del request con el token generado del login
        let tokenOK = jwt.verify(token, process.env.SALT);
        next();

    } catch (error) {
        res.status(401).send({
            status: 'error',
            message: "Token invalido o expirado",
            error: error.message,
        })
    }
}