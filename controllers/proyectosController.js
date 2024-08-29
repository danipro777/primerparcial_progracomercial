'use strict';
const db = require("../models");
const Proyectos = db.proyectos;
const Alertas = db.alertas;

// Métodos CRUD
module.exports = {
    async checkAndCreateAlerts(req, res) {
        try {
            const proyectos = await Proyectos.findAll();
            const fechaHoy = new Date();
            
            let alertasCreadas = 0;
    
            for (let proyecto of proyectos) {
                const fechaFinal = new Date(proyecto.fechaFin);
                const diasRestantes = Math.ceil((fechaFinal - fechaHoy) / (1000 * 60 * 60 * 24));
    
                // Cambio aquí: Verificar si faltan menos de 7 días
                if (diasRestantes < 7 && diasRestantes >= 0) {
                    await Alertas.create({
                        idProyecto: proyecto.idProyecto,
                        descripcion: `Faltan menos de 7 días para la fecha final del proyecto "${proyecto.nombreProyecto}".`
                    });
                    alertasCreadas++;
                }
            }
    
            if (alertasCreadas > 0) {
                return res.status(200).send({ message: `${alertasCreadas} alertas creadas.` });
            } else {
                return res.status(200).send({ message: 'No se crearon alertas. Ningún proyecto cumple con la condición de menos de 7 días restantes.' });
            }
        } catch (error) {
            console.error('Error al verificar los proyectos:', error);
            return res.status(500).send({ message: 'Error al verificar los proyectos.' });
        }
    },

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
