'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: 'Bookmark' });
    }
  }
  Project.init({
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
          msg: "Project topic is missing"
        },
      }
    },
    matricNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide matric number"
        },
        notNull: {
          msg: "Please provide matric number"
        }
      }
    },
    authorFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: {
          msg: "Author first name is missing"
        },
      }
    },
    authorLastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true,
        notEmpty: {
          msg: "Author last name is missing"
        },
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        notEmpty: {
          msg: "Year is missing"
        },
      },
    },
    url: {
      type: DataTypes.STRING,
    },
    citation: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Citation is missing"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};