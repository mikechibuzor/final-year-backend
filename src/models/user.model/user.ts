import { modelNames } from '../../helpers/constants/index.ts';

const { user } = modelNames;

const UserModel = (sequelize, DataTypes) => {
  return sequelize.define(
    user,
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};

export default UserModel;
