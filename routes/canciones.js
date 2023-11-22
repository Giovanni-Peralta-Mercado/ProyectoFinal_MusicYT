const {Router} = require('express');
const {
    ListaRegistros,
    ListaRegistrosByID,
    //ListaRegistrosByNombre
    AgregarCancion,
    ActualizarCancion,
    EliminarCancion   
}=require('../controllers/canciones');

const router = Router();

// http://localhost:3000/api/v1/informacion
router.get('/',ListaRegistros);

// http://localhost:3000/api/v1/informacion/id
router.get('/:id',ListaRegistrosByID)

// http://localhost:3000/api/v1/informacion/nombre
//router.get('/:nombre',ListaRegistrosByNombre);

// http://localhost:3000/api/v1/informacion
router.put('/',AgregarCancion);

// http://localhost:3000/api/v1/informacion/id
router.patch('/:id',ActualizarCancion,);

router.delete('/:id',EliminarCancion);


module.exports=router;