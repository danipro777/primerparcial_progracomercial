'use strict';
const db = require("../models");
const Empleados = db.empleados;

// Métodos CRUD
module.exports = {

    find(req, res) {
        return Empleados.findAll()
            .then(empleados => {
                return res.status(200).send(empleados);
            })
            .catch(error => {
                return res.status(500).send({
                    message: 'Ocurrió un error al recuperar los datos.'
                });
            });
    },

    findById(req, res) {
        const id = req.params.id;
        return Empleados.findByPk(id)
            .then(empleado => {
                if (!empleado) {
                    return res.status(404).send({
                        message: 'Empleado no encontrado.'
                    });
                }
                return res.status(200).send(empleado);
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
            nombre: datos.nombre,
            apellido: datos.apellido,
            telefono: datos.telefono,
            salario: datos.salario
        };

        Empleados.create(datosIngreso)
        .then(empleado => {
            res.status(201).send(empleado);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al insertar empleado' });
        });
    },

    update(req, res) {
        const datos = req.body;
        const id = req.params.id;

        const camposActualizados = {};
    
        if (datos.nombre !== undefined) camposActualizados.nombre = datos.nombre;
        if (datos.apellido !== undefined) camposActualizados.apellido = datos.apellido;
        if (datos.telefono !== undefined) camposActualizados.telefono = datos.telefono;
        if (datos.salario !== undefined) camposActualizados.salario = datos.salario;

        return Empleados.update(
            camposActualizados,
            {
                where: { idEmpleado: id } 
            }
        )
        .then(([rowsUpdated]) => {
            if (rowsUpdated === 0) {
                return res.status(404).send({ message: 'Empleado no encontrado' });
            }
            return res.status(200).send('El empleado ha sido actualizado');
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ error: 'Error al actualizar empleado' });
        });
    },

    async delete(req, res) {
        const id = req.params.id; 
    
        try {
            const empleado = await Empleados.findByPk(id);
    
            if (!empleado) {
                return res.status(404).json({ error: 'Empleado no encontrado' });
            }
    
            await empleado.destroy();
            return res.json({ message: 'Empleado eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            return res.status(500).json({ error: 'Error al eliminar empleado' });
        }
    }
};