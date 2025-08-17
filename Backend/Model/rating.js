const { DataTypes ,Model} = require('sequelize');


class Rating extends Model {
  static initModel(sequelize) {
    Rating.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      score: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      storeId: { type: DataTypes.INTEGER, allowNull: false }
    }, { sequelize, modelName: 'rating' });
  }
}

module.exports = Rating;