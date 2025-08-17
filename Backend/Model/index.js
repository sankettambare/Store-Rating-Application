
const sequelize = require('../Database/db');

const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');


//initialize model

User.initModel(sequelize);
Store.initModel(sequelize);
Rating.initModel(sequelize);


// associations

User.hasMany(Rating,{foreignKey:'userId',onDelete:'CASCADE'});
Rating.belongsTo(User,{foreignKey:'userId'});

Store.hasMany(Rating,{foreignKey:'storeId',onDelete:'CASCADE'});
Rating.belongsTo(Store,{foreignKey:'storeId'});

//if store has owner

User.hasMany(Store,{foreignKey:'ownerId'});
Store.belongsTo(User,{as: 'owner',foreignKey:'ownerId'})

module.exports = {sequelize,User,Store,Rating};
