'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('prescription', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      patientId: {
        type: DataTypes.STRING,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('prescription');
  },
};
