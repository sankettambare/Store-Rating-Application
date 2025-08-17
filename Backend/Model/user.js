const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
    static initModel(sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
                email: { type: DataTypes.STRING, allowNull: false, unique: true }, // no unique here
                password: { type: DataTypes.STRING, allowNull: false },
                address: { type: DataTypes.STRING },
                role: {
                    type: DataTypes.ENUM('admin', 'user', 'owner'),
                    defaultValue: 'user',
                },
            },
            {
                sequelize,
                modelName: 'user',
                tableName: 'users',
                indexes: [
                    {
                        unique: true,
                        fields: ['email'], // single unique index
                    },
                ],
            }
        );

        // Hash password before creating a user
        User.beforeCreate(async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        });
    }

    // Validate password
    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

module.exports = User;
