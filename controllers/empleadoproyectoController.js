'use strict';
const db = require("../models");
const EmpleadoProyecto = db.empleadoproyecto;

// Métodos CRUD
module.exports = {

    find(req, res) {
        return EmpleadoProyecto.findAll()
            .then(asignaciones => {
                return res.status(200).send(asignaciones);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al recuperar las asignaciones.'
                });
            });
    },

    findById(req, res) {
        const id = req.params.id;
        return EmpleadoProyecto.findByPk(id)
            .then(asignacion => {
                if (!asignacion) {
                    return res.status(404).send({
                        message: 'Asignación no encontrada.'
                    });
                }
                return res.status(200).send(asignacion);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al intentar recuperar la asignación.'
                });
            });
    },

    create(req, res) {
        let datos = req.body;
        const datosIngreso = { 
            idEmpleado: datos.idEmpleado,
            idProyecto: datos.idProyecto,
            fechaAsignacion: datos.fechaAsignacion,
            fechaLiberacion: datos.fechaLiberacion
        };

        EmpleadoProyecto.create(datosIngreso)
        .then(asignacion => {
            res.status(201).send(asignacion);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al crear la asignación' });
        });
    },

    update(req, res) {
        const datos = req.body;
        const id = req.params.id;

        const camposActualizados = {};
    
        if (datos.idEmpleado !== undefined) camposActualizados.idEmpleado = datos.idEmpleado;
        if (datos.idProyecto !== undefined) camposActualizados.idProyecto = datos.idProyecto;
        if (datos.fechaAsignacion !== undefined) camposActualizados.fechaAsignacion = datos.fechaAsignacion;
        if (datos.fechaLiberacion !== undefined) camposActualizados.fechaLiberacion = datos.fechaLiberacion;

        return EmpleadoProyecto.update(
            camposActualizados,
            {
                where: { idEmpleadoProyecto: id } 
            }
        )
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).send({ message: 'Asignación no encontrada' });
            }
            return res.status(200).send('La asignación ha sido actualizada');
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al actualizar la asignación' });
        });
    },

    async delete(req, res) {
        const id = req.params.id; 
    
        try {
            const asignacion = await EmpleadoProyecto.findByPk(id);
    
            if (!asignacion) {
                return res.status(404).json({ error: 'Asignación no encontrada' });
            }
    
            await asignacion.destroy();
            return res.json({ message: 'Asignación eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar asignación:', error);
            return res.status(500).json({ error: 'Error al eliminar asignación' });
        }
    }
};