const { Router } = require('express');
const router = Router();

// Aqui van los imports
const empleadosController = require('../controllers/empleadosController');
const proyectosController = require('../controllers/proyectosController');
const empleadoproyectoController = require('../controllers/empleadoproyectoController');

//RUTAS

module.exports = (app) => {

    //AQUI VAN LAS RUTAS
    // Rutas para empleados
    router.get('/empleados', empleadosController.find);
    router.get('/empleados/:id', empleadosController.findById);
    router.post('/empleados', empleadosController.create);
    router.put('/empleados/:id', empleadosController.update);
    router.delete('/empleados/:id', empleadosController.delete);

    // Rutas para proyectos
    router.get('/proyectos', proyectosController.find);
    router.get('/proyectos/:id', proyectosController.findById);
    router.post('/proyectos', proyectosController.create);
    router.put('/proyectos/:id', proyectosController.update);
    router.delete('/proyectos/:id', proyectosController.delete);

    router.get('/empleadoproyecto', empleadoproyectoController.find);
    router.get('/empleadoproyecto/:id', empleadoproyectoController.findById);
    router.post('/empleadoproyecto', empleadoproyectoController.create);
    router.put('/empleadoproyecto/:id', empleadoproyectoController.update);
    router.delete('/empleadoproyecto/:id', empleadoproyectoController.delete);

    app.use('/', router);

};