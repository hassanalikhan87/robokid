'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('livereadings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patientId: {
        type: Sequelize.STRING,
      },
      volume: {
        type: Sequelize.INTEGER,
      },
      ipc_states: {
        type: Sequelize.STRING,
      },
      currentState: {
        type: Sequelize.STRING,
      },
      cycles: {
        type: Sequelize.INTEGER,
      },
      therapyTime: {
        type: Sequelize.STRING,
      },
      patientPressure: {
        type: Sequelize.FLOAT,
      },
      sourcePressure: {
        type: Sequelize.FLOAT,
      },
      rpm: {
        type: Sequelize.STRING,
      },
      sourceBag: {
        type: Sequelize.INTEGER,
      },
      isPatientPressure: {
        type: Sequelize.BOOLEAN,
      },
      isSourcePressure: {
        type: Sequelize.BOOLEAN,
      },
      isWsTamper: {
        type: Sequelize.BOOLEAN,
      },
      targetVolume: {
        type: Sequelize.INTEGER,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('livereadings');
  },
};

// patientId,
// volume,
// ipc_states,
// currentState,
// cycles,
// therapyTime,
// patientPressure,
// sourcePressure,
// rpm,
// sourceBag,
// isPatientPressure,
// isSourcePressure,
// isWsTamper,
// targetVolume,
// isActive
