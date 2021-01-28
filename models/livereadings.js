'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class liveReadings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  liveReadings.init(
    {
      patientId: DataTypes.STRING,
      volume: DataTypes.INTEGER,
      ipc_states: DataTypes.STRING,
      currentState: DataTypes.STRING,
      cycles: DataTypes.INTEGER,
      therapyTime: DataTypes.STRING,
      patientPressure: DataTypes.FLOAT,
      sourcePressure: DataTypes.FLOAT,
      rpm: DataTypes.STRING,
      sourceBag: DataTypes.INTEGER,
      isPatientPressure: DataTypes.BOOLEAN,
      isSourcePressure: DataTypes.BOOLEAN,
      isWsTamper: DataTypes.BOOLEAN,
      targetVolume: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'livereadings',
      modelName: 'LiveReadings',
    },
  );
  return liveReadings;
};
