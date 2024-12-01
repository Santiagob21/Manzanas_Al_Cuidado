const express = require('express'); // para crear servidor 
const bodyParser = require('body-parser'); // middleware para analizar el cuerpo de solicitudes 
const mysql2 = require('mysql2/promise'); // conexión y promesas de SQL 
const path = require('path'); // para manejo de rutas 
const moment = require('moment'); // biblioteca para manejar fechas y horas 
const session = require('express-session'); // middleware para manejar sesiones de usuario 
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname)));

// Configurar usuario
app.use(session({
    secret: 'Miapp',
    resave: false,
    saveUninitialized: true
}));

// Conexión a la base de datos
const db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MANZANAS_DEL_CUIDADO'
};

// Crear usuario

app.post('/crear', async (req, res) => {
    const { Tipo, Documento, Nombre, Man } = req.body;

    try {
        const conect = await mysql2.createConnection(db);


        conect.execute('INSERT INTO usuario (Tipo, Documento, Nombre, Id_M1) VALUES (?,?,?,?)', [Tipo, Documento, Nombre, Man])

        res.sendFile(path.join(__dirname, '../public/inicio.html'))

        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar sesión de usuario
app.post('/iniciar', async (req, res) => {
    const { Tipo, Documento } = req.body;

    try {
        const conect = await mysql2.createConnection(db);
        const [datos] = await conect.execute('SELECT * FROM usuario WHERE Tipo=? AND Documento=?', [Tipo, Documento]);

        if (datos.length > 0) {
            req.session.usuario = datos[0].Nombre;
            req.session.Documento = datos[0].Documento;
            const usuario = { nombre: datos[0].Nombre };
            const Documento =  { Documento:datos[0].Documento };        
            res.locals.usuario = usuario;
            res.locals.Documento = Documento;
            console.log(Documento)
            res.sendFile(path.join(__dirname, '../public/usuario.html'));
        } else {
            res.sendFile(path.join(__dirname, '../public/ingreso.html'));
        }

        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener los servicios relacionados con la manzana del usuario
app.post('/obtener-servicios-usuario', async (req, res) => {
    const Documento = req.session.Documento;

    try {
        const conect = await mysql2.createConnection(db);

        // Obtener el ID de la manzana a la que pertenece el usuario mediante su Documento
        const [datos] = await conect.execute('SELECT m.Id_M FROM usuario us JOIN manzanas m ON us.id_M1 = m.Id_M WHERE us.Documento = ?', [Documento]);

        if (datos.length > 0) {
            const idManzana = datos[0].Id_M;

            // Obtener los servicios asociados a la manzana del usuario
            const [servicios] = await conect.execute('SELECT ser.Nombre_servicio FROM servicios ser JOIN manzanas_servicios ms ON ser.id_servicio = ms.fk_id_servicio WHERE ms.Id_M2 = ?', [idManzana]);

            if (servicios.length > 0) {
                // Devolver solo los nombres de los servicios
                res.json({ servicios: servicios.map(servicio => servicio.Nombre_servicio) });
            } else {
                res.json({ servicios: [] }); // Si no hay servicios asociados
            }
        
        } else {
            res.status(404).send('Usuario no encontrado en la manzana');
        }

        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});




// Obtener nombre de usuario
app.get('/obtener-usuario', (req, res) => {
    const usuario = req.session.usuario;
    if (usuario) {
        res.json({ nombre: usuario });
    } else {
        res.status(401).send('Usuario no autenticado');
    }
});

// Guardar servicios de un usuario
app.post('/guardar-servicios-usuario', async (req, res) => {
    const Documento = req.session.Documento;
    const { servicios, fechaHora } = req.body;

    try {
        const conect = await mysql2.createConnection(db);

        // Obtener el ID de la mujer del usuario por el Documento
        const [IDU] = await conect.execute('SELECT id_mujer FROM usuario WHERE Documento = ?', [Documento]);

        if (IDU.length === 0) {
            return res.status(400).send('Usuario no encontrado');
        }

        // Insertar una solicitud en la tabla 'solicitudes' por cada servicio

        servicios.forEach((servicio) => {
            conect.execute('SELECT id_servicio FROM servicios WHERE Nombre_servicio = ?', [servicio])
                .then(res =>
                    conect.execute('INSERT INTO solicitudes (Fecha_asistencia, fk_id_servicios) VALUES (?, ?)', [fechaHora, res[0][0].id_servicio]))
        })

        res.status(200).send('Servicio guardado');

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener los servicios guardados de un usuario
app.post('/obtener-servicios-guardados', async (req, res) => {
    const Documento = req.session.Documento;
     console.log(Documento, 80) 
    try {
        const conect = await mysql2.createConnection(db);

        // Obtener el ID de la mujer del usuario
        const [IDU] = await conect.execute('SELECT id_mujer FROM usuario WHERE Documento = ?', [Documento]);
        console.log(IDU[0])

        if (IDU.length === 0) {
            return res.status(400).send('Usuario no encontrado');
        }

        // Consultar los servicios guardados para ese usuario
        const [serviciosGuardadosData] = await conect.execute('SELECT servicios.Nombre_servicio, solicitudes.Fecha_asistencia, solicitudes.id_solicitud FROM servicios INNER JOIN manzanas_servicios ON servicios.id_servicio = manzanas_servicios.fk_id_servicio INNER JOIN manzanas ON manzanas_servicios.Id_M2 = manzanas.Id_M INNER JOIN usuario ON manzanas.Id_M = usuario.id_mujer INNER JOIN solicitudes ON usuario.id_mujer = solicitudes.id_solicitud WHERE solicitudes.id_solicitud = ?', [IDU[0].id_mujer]);
        console.log(serviciosGuardadosData)
       
        // Filtrar y devolver los servicios con el formato adecuado
        const serviciosGuardadosFiltrados = serviciosGuardadosData.map(servicio => ({
            Nombre: servicio.Nombre_servicio,
            Fecha_asistencia: servicio.Fecha_asistencia,
            id: servicio.id_solicitud
        }));

        res.json({ serviciosGuardados: serviciosGuardadosFiltrados });
        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar servicio
app.delete('/eliminar/:id', async (req, res) => {
    const servicioId = req.params.id;
    try {
        const conect = await mysql2.createConnection(db);
        await conect.execute('DELETE FROM solicitudes WHERE Id_solicitud=?', [servicioId]);
        res.send().status(200);
        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

// Cerrar sesión
app.post('/cerrar', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar", err);
            res.status(500).send("Error al cerrar");
        } else {
            res.status(200).send('Sesión cerrada');
        }
    });
});

// Apertura del servidor
app.listen(3000, () => {
    console.log('Servidor Node.js escuchando en el puerto 3000');
});