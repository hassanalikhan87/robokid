'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  doctor.init(
    {
      doctorName: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      hospital: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'doctor',
      modelName: 'Doctor',
    },
  );
  return doctor;
};

// npx sequelize-cli model:generate --name LiveReadings --attributes patientId:string,volume:integer,ipc_states:string,currentState:string,cycles:integer,therapyTime:string,patientPressure:float,sourcePressure:float,rpm:string,sourceBag:integer,isPatientPressure:boolean,isSourcePressure:boolean,isWsTamper:boolean,targetVolume:integer
