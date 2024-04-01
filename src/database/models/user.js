'use strict';
const {
  Model
} = require('sequelize');
const validator = require("validator");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Token, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      this.belongsToMany(models.Project, { through: 'Bookmarks'});
    }

  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "email",
        msg: "You sure say na you get this email adress??? Because person don use am plaster with us before",
      },
      validate: {
        isEmail: {
          msg: "Be like the email wey you drop no valid. Check am again boss",
        },
        notNull: {
          msg: "Try again. This time around, make sure say you drop your email address",
        },
        isStudentEmail(value) {
          if (value && value.split('@')[1] != "stu.ui.edu.ng")
            throw new Error("Please provide your student email address")
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isPasswordAllowed(value) {
          if (value && !validator.isStrongPassword(value)) {
            throw new Error("Alaye, make this password rugged small nau... Just make sure say the length of your password no dey less than 8. Also, make sure say you slap am with at least 1 of each of the following: uppercase letter, lowercase, digit, special character")
          }
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    code: DataTypes.STRING,
    codeExpDate: DataTypes.DATE
  }, {
    timestamps: false,
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user, options) => {
        const salt = await bcrypt.genSalt();
        const hashedPsw = await bcrypt.hash(user.password, salt);
        user.password = hashedPsw
      },
      beforeUpdate: async (user, options) => {
        if (!user.changed('password')) return;
        const salt = await bcrypt.genSalt();
        const hashedPsw = await bcrypt.hash(user.password, salt);
        user.password = hashedPsw
      },
    }
  });
  return User;
};