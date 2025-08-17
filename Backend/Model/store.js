const { DataTypes, Model } = require('sequelize');

class Store extends Model {
  static initModel(sequelize) {
    Store.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      ownerId: {   // use camelCase consistently
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // table name of User model
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }
    }, {
      sequelize,
      modelName: 'store',
    });
  }
}

module.exports = Store;
