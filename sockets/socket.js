const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');
const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');

// console.log(bands);

// Mensajes de sockets
io.on('connection', (client) => {
    console.log("Cliente conectado");

    console.log(client.handshake.headers['x-token']);

    const { ok, uid, msg } = comprobarJWT(client.handshake.headers['x-token']);

    // verificar autenticacion
    if (!ok) {
        return client.disconnect();
    }

    // cliente autenticado
    usuarioConectado(uid);


    // ingresar al usuario a una sala en particular
    // sala global, client.id
    client.join(uid);

    // escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {
        console.log(payload);
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    })

    client.on('disconnect', () => {
        console.log("Cliente desconectado");
        usuarioDesconectado(uid);
    });
});