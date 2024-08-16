'use strict';
const db = require("../models");
const Proyectos = db.proyectos;

// Métodos CRUD
module.exports = {

    find(req, res) {
        return Proyectos.findAll()
            .then(proyectos => {
                return res.status(200).send(proyectos);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al recuperar los datos.'
                });
            });
    },

    findById(req, res) {
        const id = req.params.id;
        return Proyectos.findByPk(id)
            .then(proyecto => {
                if (!proyecto) {
                    return res.status(404).send({
                        message: 'Proyecto no encontrado.'
                    });
                }
                return res.status(200).send(proyecto);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al intentar recuperar el registro.'
                });
            });
    },

    create(req, res) {
        let datos = req.body;
        const datosIngreso = { 
            nombreProyecto: datos.nombreProyecto,
            descripcion: datos.descripcion,
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin,
            porcentajeCompletado: datos.porcentajeCompletado
        };

        Proyectos.create(datosIngreso)
        .then(proyecto => {
            res.status(201).send(proyecto);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al insertar proyecto' });
        });
    },

    update(req, res) {
        const datos = req.body;
        const id = req.params.id;

        const camposActualizados = {};
    
        if (datos.nombreProyecto !== undefined) camposActualizados.nombreProyecto = datos.nombreProyecto;
        if (datos.descripcion !== undefined) camposActualizados.descripcion = datos.descripcion;
        if (datos.fechaInicio !== undefined) camposActualizados.fechaInicio = datos.fechaInicio;
        if (datos.fechaFin !== undefined) camposActualizados.fechaFin = datos.fechaFin;
        if (datos.porcentajeCompletado !== undefined) camposActualizados.porcentajeCompletado = datos.porcentajeCompletado;

        return Proyectos.update(
            camposActualizados,
            {
                where: { idProyecto: id } 
            }
        )
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).send({ message: 'Proyecto no encontrado' });
            }
            return res.status(200).send('El proyecto ha sido actualizado');
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al actualizar proyecto' });
        });
    },

    async delete(req, res) {
        const id = req.params.id; 
    
        try {
            const proyecto = await Proyectos.findByPk(id);
    
            if (!proyecto) {
                return res.status(404).json({ error: 'Proyecto no encontrado' });
            }
    
            await proyecto.destroy();
            return res.json({ message: 'Proyecto eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
            return res.status(500).json({ error: 'Error al eliminar proyecto' });
        }
    }
};
