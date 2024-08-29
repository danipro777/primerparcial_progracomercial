'use strict';
const db = require('../models');
const Alertas = db.alertas;

module.exports = {

    // Obtener todas las alertas
    find(req, res) {
        return Alertas.findAll()
            .then(alertas => {
                return res.status(200).send(alertas);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al recuperar los datos de alertas.'
                });
            });
    },

    // Obtener una alerta por su ID
    findById(req, res) {
        const id = req.params.id;
        return Alertas.findByPk(id)
            .then(alerta => {
                if (!alerta) {
                    return res.status(404).send({
                        message: 'Alerta no encontrada.'
                    });
                }
                return res.status(200).send(alerta);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al intentar recuperar el registro.'
                });
            });
    },

    // Crear una nueva alerta
    create(req, res) {
        const datos = req.body;
        const datosIngreso = { 
            descripcion: datos.descripcion,
            idProyecto: datos.idProyecto
        };

        return Alertas.create(datosIngreso)
            .then(alerta => {
                return res.status(201).send(alerta);
            })
            .catch(error => {
                return res.status(500).json({ 
                    message: 'Error al insertar alerta',
                    error: error.message
                });
            });
    },

    // Actualizar una alerta existente
    update(req, res) {
        const datos = req.body;
        const id = req.params.id;

        const camposActualizados = {};
    
        if (datos.descripcion !== undefined) camposActualizados.descripcion = datos.descripcion;
        if (datos.idProyecto !== undefined) camposActualizados.idProyecto = datos.idProyecto;

        return Alertas.update(camposActualizados, { where: { idAlertas: id } })
            .then(([rowsUpdated]) => {
                if (rowsUpdated === 0) {
                    return res.status(404).send({ message: 'Alerta no encontrada' });
                }
                return res.status(200).send('La alerta ha sido actualizada');
            })
            .catch(error => {
                return res.status(500).json({ 
                    message: 'Error al actualizar alerta',
                    error: error.message 
                });
            });
    },    

    // Eliminar una alerta por su ID
    delete(req, res) {
        const id = req.params.id; 
    
        return Alertas.findByPk(id)
            .then(alerta => {
                if (!alerta) {
                    return res.status(404).json({ message: 'Alerta no encontrada' });
                }

                return alerta.destroy()
                    .then(() => {
                        return res.status(200).send({ message: 'Alerta eliminada correctamente' });
                    });
            })
            .catch(error => {
                return res.status(500).json({ 
                    message: 'Error al eliminar alerta',
                    error: error.message
                });
            });
    }
};