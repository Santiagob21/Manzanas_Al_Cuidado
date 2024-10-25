const express = require('express')
const bodyParser = require('body-parser')
const mysql2 = require('mysql2/promise')
const path= require('path')
const moment=require('moment')
const session=require('express-session')
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
app.post('/crear',async (req,res)=>{
    const {Nombre,Tipo,Documento,Man}=req.body
    try{
        //verificar el usuario
        const conect=  await mysql2.createConnection(db)
        const [veri]= await conect.execute('SELECT * FROM usuario WHERE Documento=? AND Tipo=?', [Documento, Tipo])

        if(verify.length>0){
            res.status(409).send(`
                <script>
                window.onload=function(){
                alert("usuario ya existe")
                window.location.href='../inicio.html'
                }
                </script>
                `)
        }
    
        else{
            await conect.execute('INSERT INTO usuario (Nombre,Tipo,Documento,Id_M1) VALUES (?,?,?,?)',[Nombre, Tipo, Documento, Man])
            res.status(201).send(`
                <script>
                window.onload=function(){
                alert("Datos guardados")
                window.location.href='../inicio.html'
                }
                </script>
                `)
        }
                 await conect.end()
    }

    catch(error){
        console.error('Error en el servidor:',error)
        res.status(500).send('Error en el servidor');
    }
    
 })

 //enviar pagina usuario
app.post('/iniciar',async (req, res)=>{
    const {Tipo,Documento}=req.body
    try{
        const conect=  await mysql12.createConnection(db)
        const [datos]=await conect.execute('SELECT * FROM usuario WHERE Documento=? AND Tipo=?', [Tipo, Documento])
        console.log(datos)
        if (datos.length>0){
            //const [man]=await conect.execute('SELECT manzanas.Nombre FROM usuario INNER JOIN manzanas ON usuario.Id_M WHERE usuario.Nombre=?',[datos[0].Nombre])
            req.session.usuario=datos[0].Nombre
            req.session.Documento=Documento
            const usuario={nombre: datos[0].Nombre}
            res.locals.usuario.usuario=usuario
            res.locals.Documento=Documento
            res.sendFile(path.join(__dirname,'../ingreso.html'))
            await conect.end()
        }
        else{
            res.status(401).send('paila')
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
// Apertura del servidor
app.listen(3000, ()=>{
    console.log('Servidor Node.js escuchando')
})







