 const express = require('express') //para crear servidor 
const bodyParser = require('body-parser') //mildware para analizar el cuerpo de solicitudes 
const mysql2 = require('mysql2/promise') // conceccion y promesas de sql 
const path= require('path') //para manejo de rutas 
const moment=require('moment') //biblioteca para manejar fechas y horas 
const session=require('express-session') //middleware para manejar sesiones de usuario 
const { connect }=require ('http2')
const app=express()

// Middleware
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname)))

//configurar usuario
app.use(session({
    secret: 'Miapp',
    resave:false,
    saveUninitialized:true
}))

//Conexion BBDD
const db= {
    host:'localhost',
    user:'root',
    password:'',
    database:'MANZANAS_DEL_CUIDADO'
}

// Registrar usuario

app.post('/crear', async (req, res) => {
    const { Nombre, Tipo, Documento, Man } = req.body;
    try {
        const conect = await mysql2.createConnection(db);
        const [veri] = await conect.execute('SELECT * FROM usuario WHERE Documento=? AND Tipo=?', [Documento, Tipo]);

        if (veri.length > 0) {
            res.status(409).send(`
                <script>
                window.onload=function(){
                    alert("Usuario ya existe");
                    window.location.href='../inicio.html';
                }
                </script>
                `);
        } else {
            await conect.execute('INSERT INTO usuario (Nombre, Tipo, Documento, Id_M1) VALUES (?, ?, ?, ?)', [Nombre, Tipo, Documento, Man]);
            res.status(201).send(`
                <script>
                window.onload=function(){
                    alert("Datos guardados");
                    window.location.href='../inicio.html';
                }
                </script>
                `);
        }
        await conect.end();
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
});

 //enviar pagina usuario
app.post('/iniciar',async (req, res)=>{
    const {Tipo,Documento}=req.body
    try{
        const conect=  await mysql2.createConnection(db)
        const [datos]=await conect.execute('SELECT * FROM usuario WHERE  Tipo=? AND Documento=?', [Tipo, Documento])
        console.log(datos)
        if (datos.length>0){
            //const [man]=await conect.execute('SELECT manzanas.Nombre FROM usuario INNER JOIN manzanas ON usuario.Id_M WHERE usuario.Nombre=?',[datos[0].Nombre])
            req.session.usuario=datos[0].Nombre
            req.session.Documento=Documento
            const usuario={nombre: datos[0].Nombre}
            res.locals.usuario=usuario
            res.locals.Documento=Documento
            res.sendFile(path.join(__dirname,'../public/usuario.html'))
            console.log(__dirname)
            await conect.end()
            
        }
        else{
            res.sendFile(path.join(__dirname, '../public/ingreso.html'))
        }
        await conect.end()
    }
    catch(error){
        console.error('Error en el servidor:',error)
        res.status(500).send('Error en el servidor');
    }
})

app.get('/obtener-usuario',(req, res)=>{
    const usuario=req.session.usuario
    if(usuario){
        res.json({nombre:usuario})
    }
    else{
        res.status(401).send('Usuario no autenticado')
    }
})
//obtener usuario
app.post('../public/usuario.html/obtener-servicios-usuario',async (req, res)=>{

    req.session.Documento=Documento
    try{
        const conect = await mysql2.createConnection(db)
        //consulta para obtener el nombre de los servicios asociados a la manzana del usuario mediante el documeento o el nombre
        const [datos] = await conect.execute('SELECT ser.Nombre_servicio FROM servicios ser JOIN manzanas_servicios ms ON ser.id_servicio = ms.fk_id_servicio JOIN manzanas m ON ms.Id_M2 = m.Id_M  JOIN usuario us ON us.id_M1 = m.Id_M WHERE Documento = (?)', [Docuemento])
        console.log(datos)
        res.json({servicios: datos.map(hijo=>hijo.Nombre)})
        await conect.end()    
    }
    catch{
        console.error('Error en el servidor:',error)
        res.status(500).send('Error en el servidor');
    }
})
//enviar servicios
app.post('../public/usuario.html/guardar-servicios-usuario',async (req,res)=>{
const usuario=req.session.usuario
const Documento=req.session.Documento
const {servicios,fechaHora}=req.body
console.log(servicios)
try{
const conect=await mysql2.createConnection(db)
const [IDS]=await conect.execute('SELECT servicios.id_Servicio FROM servicios WHERE servicios.Nombre=?',[servicios])
const [IDU]=await conect.execute('SELECT usuario.Id FROM usuario WHERE usuario.Documento=? ',[Documento]) 
await conect.execute('INSERT  INTO solicitudes (Fecha_asistencia, id_solicitud, fk_id_servicios) VALUES (?,?,?)',[fechaHora, IDS[0],IDU[0]])
res.status(200).send('servicio guardado') 
await conect.end()
}
catch(error){
console.error('error en el servidor: ', error)
res.status(500).send('error en el servidor');
}

})
// Apertura del servidor
app.listen(3000, ()=>{
    console.log('Servidor Node.js escuchando')
})


