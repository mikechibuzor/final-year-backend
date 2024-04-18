'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bookmark.init({
    
  }, {
    sequelize,
    modelName: 'Bookmark',
    indexes: [
      {
        name: 'unique_bookmark',
        unique: true,
        fields: ['userId', 'projectId']
      }
    ]
  });
  return Bookmark;
};