'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supervisor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Project, {
        foreignKey: {
          name: "supervisorId",
          allowNull: false,
        },
        onDelete: "RESTRICT",
      });
    }
  }
  Supervisor.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Supervisor title is missing"
        },
      }
    },
    initials: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Supervisor initials is missing"
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Supervisor last name is missing"
        },
      }
    }
  }, {
    timestamps: false,
    sequelize,
    modelName: 'Supervisor',
  });
  return Supervisor;
};