const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DBHOST,
  dialect: 'mysql',
  operatorsAliases: 0,
  // dialectOptions: {
  //   ssl: {
  //     MYSQL_ATTR_SSL_CA: '/etc/ssl/cert.pem',
  //   }
  // },
  hooks: {
    beforeDefine: function (columns, model) {
      // model.tableName = 'initial_' + model.name.plural
    },
    afterCreate: (record) => {
      delete record.dataValues.password
    },
    afterUpdate: (record) => {
      delete record.dataValues.password
    },
  },
  define: {
    timestamps: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const db = {
  sequelize: sequelize,
  User: require('./user')(sequelize, Sequelize),
  Session: require('./session')(sequelize, Sequelize),
}

module.exports = db

// Association section

db.sequelize.sync({ alter: true, }).then(() => { console.log('Yes re-sync') })
