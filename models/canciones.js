const cancionesModel ={

    ObtenerTodo:`
    SELECT
        *
    FROM
        informacion
    `,

    ObtenerPorID:`
    SELECT
        *
    FROM
        informacion
    WHERE
        id=?
    `,

    ObtenerPorNombre:`
    SELECT
        *
    FROM
        informacion
    WHERE
        nombre=?
    `,

    AgregarCancion:`
   INSERT INTO
        informacion(
            nombre,
            descripcion,
            Autor_es,
            duracion,
            vistas,
            me_gustas,
            fecha_publicacion,
            plataformas_ver
        )
    
    VALUES(
        ?,?,?,?,?,?,?,?
    )

    `,

    ActualizarCancion:`
    UPDATE
        informacion
    SET
        nombre = ?,
        descripcion = ?,
        Autor_es = ?,
        duracion = ?,
        vistas = ?,
        me_gustas = ?,
        fecha_publicacion = ?,
        plataformas_ver = ?
    WHERE
        id=?`,
    

    EliminarCancion: `
    DELETE FROM 
        informacion
    WHERE 
        id=?
    `,



};

module.exports=cancionesModel;