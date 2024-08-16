'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class empleados extends Model {
      static associate(models) {
          empleados.belongsToMany(models.proyectos, {
              through: models.empleadoproyecto,
              foreignKey: 'idEmpleado'
          });
      }
  };

  empleados.init({
    idEmpleado: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    salario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'empleados',
    timestamps: false
  });

  return empleados;
};
