const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cancionesRouter=require('./routes/canciones');

class Server{
    constructor(){
        this.app=express(); 
        this.port=process.env.PORT;     
        
        //http://localhost:3000/api/v1/informacion
        this.basePath='/api/v1'
        this.cancionesPath=`${this.basePath}/informacion`;

        this.middlewares();
        this.routes();

    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()); 
    }

    routes(){
        this.app.use(this.cancionesPath,cancionesRouter);
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log("Listening on port "+this.port);
        })
    }
}
module.exports = Server;