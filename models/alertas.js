'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class alertas extends Model {
    static associate(models) {
      // Asociación con la tabla `proyectos`
      alertas.belongsTo(models.proyectos, {
        foreignKey: 'idProyecto',
        as: 'proyecto'
      });
    }
  };

  alertas.init({
    idAlertas: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idProyecto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'proyectos',
        key: 'idProyecto'
      }
    }
  }, {
    sequelize,
    modelName: 'alertas',
    timestamps: false,
  });

  return alertas;
};