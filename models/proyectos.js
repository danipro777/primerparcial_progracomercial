'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class proyectos extends Model {
      static associate(models) {
          proyectos.belongsToMany(models.empleados, {
              through: models.empleadoproyecto,
              foreignKey: 'idProyecto'
          });
      }
  };

  proyectos.init({
    idProyecto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombreProyecto: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    porcentajeCompletado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    }
  }, {
    sequelize,
    modelName: 'proyectos',
    timestamps: false
  });

  return proyectos;
};