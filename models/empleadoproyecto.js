'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class empleadoproyecto extends Model {
      static associate(models) {
          empleadoproyecto.belongsTo(models.empleados, { foreignKey: 'idEmpleado' });
          empleadoproyecto.belongsTo(models.proyectos, { foreignKey: 'idProyecto' });
      }
  };

  empleadoproyecto.init({
    idEmpleadoProyecto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idEmpleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProyecto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaAsignacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaLiberacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'empleadoproyecto',
    tableName: 'empleadoproyecto',
    timestamps: false
  });

  return empleadoproyecto;
};
