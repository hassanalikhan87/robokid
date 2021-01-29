'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// console.log(Sequelize);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
// console.log(config);
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    {
      // database: 'da6lkm0ngoggpo',
      // username: 'rvxvlswceedgdk',
      // password:
      //   '89ad3731e40da42ea594a0dac393f46e27fe9a97142ff95b1e1bed6fc990abb2',
      // host: 'ec2-52-4-177-4.compute-1.amazonaws.com',
      port: 5432,
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },

    // config,
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
