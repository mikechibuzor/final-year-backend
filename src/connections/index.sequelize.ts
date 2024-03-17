import createSequelize from '../helpers/sequelize/index.ts';

const config = {
  environment: {
    database: 'postgres',
    username: 'chibuzoriwuagwu',
    password: '',
    dialect: 'postgres',
    host: 'localhost',
    port: 5432
  }
}

export const sequelizeInstance = () => {
  const { username, password, dialect, host, port, database } = config['environment'];

  const dbConfig = { host, dialect, port };

  const connString = {
    database,
    username,
    password,
    dbConfig,
  };

  return createSequelize(connString);
};
