'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  Prescription.init(
    {
      patientId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      machineId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dwellTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fillVolume: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalCycles: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expectedUF: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      maxDrain: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfBags: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastFill: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      lastFillVolume: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isLatest: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'prescription',
      modelName: 'Prescription',
    },
  );
  return Prescription;
};
