const { Sequelize, DataTypes, Model  } = require('sequelize');
const config = require('../../config/app');

const conn = new Sequelize(config.db_name, config.db_user, config.db_password, {
    host: config.db_server, // Host do banco de dados MySQL
    dialect: 'mysql',
  });

class Usuario extends Model { }

Usuario.init({
  id : {
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  senha:{
      type: DataTypes.STRING(64),
      allowNull: false
  }
  },{
  sequelize: conn,
  tableName: 'usuarios', 
  modelName: 'Usuario'});

  //funcao invacoda imediatamente
( async ()=>{
    
  try{
      await Usuario.sync({ force : false });

  }catch(erro){
      console.log(erro);
  }

})();

module.exports = {
    conn: conn,
    Usuario: Usuario
}
