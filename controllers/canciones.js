const {request,response} = require('express');
const pool = require('../db');
const cancionesModel = require('../models/canciones');


//MUESTRA TODOS LOS REGISTROS DE LA BASE DE DATOS
const ListaRegistros= async(req = request,res=response)=>{
    let conn;
    try {
        conn = await pool.getConnection();
        
        const  canciones = await conn.query(cancionesModel.ObtenerTodo,(err)=>{
            if(err){
                throw new Error(err);   
            }
        })

        res.json(canciones);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}



//MUESTRA EL REGISTRO DEL ID ESPECIFICADO
const ListaRegistrosByID= async(req = request,res=response)=>{
    const{id}=req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'ID Invalido'});
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        
        const [canciones] = await conn.query(cancionesModel.ObtenerPorID,[id],(err)=>{  
            if(err){
                throw new Error(err);    
            }
        })

        if(!canciones){
            res.status(404).json({msg:'Cancion no encontrada'});
            return;
        }

        res.json(canciones);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}



//MUESTRA EL REGISTRO DEL NOMBRE ESPECIFICADO
/*const ListaRegistrosByNombre = async (req = request, res = response) => {
    const{nombre}=req.params;

     if(!isNaN(nombre)){
        res.status(400).json({msg:'ID Invalido'});
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        
        const [canciones] = await conn.query(cancionesModel.ObtenerPorNombre,[nombre],(err)=>{  
            if(err){
                throw new Error(err);    
            }
        })

        if(!canciones){
            res.status(404).json({msg:'Cancion no encontrada'});
            return;
        }

        res.json(canciones);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}*/



//AGREGA UN NUEVO REGISTRO A LA BASE DE DATOS
const AgregarCancion = async (req = request,res = response) =>{
    const {
        nombre,
        descripcion='',
        Autor_es,
        duracion,
        vistas,
        me_gustas,
        fecha_publicacion,
        plataformas_ver=''
     } = req.body;

     if(!nombre || !Autor_es || !duracion || !vistas || !me_gustas || !fecha_publicacion){
        res.status(400).json({msg: 'Missing information'});
        return;
     }

     const cancion = [
        nombre,
        descripcion,
        Autor_es,
        duracion,
        vistas,
        me_gustas,
        fecha_publicacion,
        plataformas_ver
     ]; 


    let conn;

    try {
        conn = await pool.getConnection();

        const [NombreCancion] = await conn.query(
            cancionesModel.ObtenerPorNombre,
            [nombre],
            (err) => {if (err) throw err;}
        );
        if(NombreCancion) {
            res.status(409).json({msg:`Cancion con el nombre: ${nombre}, ya existe`});
            return;
        }


        const CancionAgregada = await conn.query(
            cancionesModel.AgregarCancion, 
            [...cancion], 
            (err) => {if (err) throw err;}
        );
        
        if (CancionAgregada.affectedRows === 0) throw new Error({msg: 'Fallo al agregar cancion'});

        res.json({msg: 'Cancion agregada Correctamente'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        
    }finally{
        if(conn) conn.end();
    }
}


//ACTUALIZA LOS DATOS DEL REGISTRO DE LA BASE DE DATOS
const ActualizarCancion=async(req, res)=>{
    const {
        nombre,
        descripcion,
        Autor_es,
        duracion,
        vistas,
        me_gustas,
        fecha_publicacion,
        plataformas_ver
     } = req.body;

const {id} = req.params;


let NuevaInfCancion=[
    nombre,
    descripcion,
    Autor_es,
    duracion,
    vistas,
    me_gustas,
    fecha_publicacion,
    plataformas_ver  
];
let conn;
try{
    conn = await pool.getConnection();
const [CancionExists]=await conn.query(
    cancionesModel.ObtenerPorID,
    [id],
    (err) => {if (err) throw err;}
);
if (!CancionExists){
    res.status(404).json({msg:'Cancion no encontrada'});
    return;
}

const [NombreCancion] = await conn.query(
    cancionesModel.ObtenerPorNombre,
    [nombre],
    (err) => {if (err) throw err;}
);
if (NombreCancion){
    res.status(409).json({msg:`Cancion con el nombre: ${nombre}, ya existe`});
    return;
}

const AntiguaInfCancion = [
    CancionExists.nombre,
    CancionExists.descripcion,
    CancionExists.Autor_es,
    CancionExists.duracion,
    CancionExists.vistas,
    CancionExists.me_gustas,
    CancionExists.fecha_publicacion,
    CancionExists.plataformas_ver  
];

NuevaInfCancion.forEach((CancionInf, index)=> {
    if (!CancionInf){
        NuevaInfCancion[index] = AntiguaInfCancion[index];
    }
})

const ActualizarInf = await conn.query(
    cancionesModel.ActualizarCancion,
    [...NuevaInfCancion, id],
    (err) => {if (err) throw err;}
);
if(ActualizarInf.affecteRows === 0){
    throw new Error ('Cancion no actualizada');
}
res.json({msg:'Cancion actualizada correctamente'})
}catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}


//ELIMINA POR COMPLETO EL REGISTRO EN LA BASE DE DATOS
const EliminarCancion = async (req = request, res = response) => {
    const { id } = req.params;

    if(isNaN(id)){
        res.status(400).json({msg:'ID Invalido'});
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const cancionEliminar = await conn.query(cancionesModel.EliminarCancion, [id]);

        if (cancionEliminar.affectedRows === 0) {
            res.status(404).json({ msg: 'Cancion no encontrada' });
            return;
        }

        res.json({ msg: 'Cancion eliminada correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
};



module.exports={
    ListaRegistros,
    ListaRegistrosByID,
    //ListaRegistrosByNombre
    AgregarCancion,
    ActualizarCancion,
    EliminarCancion
};