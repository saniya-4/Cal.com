const { Sequelize } = require('sequelize');
 const sequelize = new Sequelize('cal_clone', 'root', 'Root', {
  host: 'localhost',
  dialect: 'mysql'
});
const dbConnection=async()=>
{
 
try {
  await sequelize.authenticate();

console.log("Connected database:", sequelize.config.database);
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
module.exports=sequelize;