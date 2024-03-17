import userModel from './user.model/index.ts';

function model() {
  const { userSequelize, user } = userModel();

  const models = {
    userSequelize,
    user,
  };

  const sequelizeInstances = [userSequelize];

  return {
    sequelizeInstances,
    models,
  };
}

export default model;
