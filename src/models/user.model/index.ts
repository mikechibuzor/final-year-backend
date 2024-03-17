import {Sequelize, DataTypes} from 'sequelize';
import { sequelizeInstance } from '../../connections/index.sequelize.ts'
import appUserModel from './user.ts'

type UserDBObject = Record<any, any>

function user(): UserDBObject {
  const userDB: UserDBObject = {};

  const sequelize = sequelizeInstance();
  const user = appUserModel(sequelize, DataTypes);


  userDB.User = user
  userDB.userSequelize = sequelize;
  userDB.UserSequelize = Sequelize;

  return userDB;
}

export default user;