'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  patient.init(
    {
      patientId: { type: DataTypes.STRING, allowNull: false },
      patientAddress: { type: DataTypes.STRING, allowNull: false },
      patientName: { type: DataTypes.STRING, allowNull: false },
      doctorId: { type: DataTypes.INTEGER, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      dateOfBirth: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      tableName: 'patient',
      modelName: 'Patient',
    },
  );
  return patient;
};
