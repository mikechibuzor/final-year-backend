import {Sequelize} from 'sequelize';

type ConnectionStringObject = {
    database: string
    username: string
    password: string
    dbConfig: object
}
export default function createSequelize(connectionString: ConnectionStringObject) {
  return new Sequelize(
    connectionString.database,
    connectionString.username,
    connectionString.password,
    {
      ...connectionString.dbConfig,
      logging: false,
    }
  );
}
